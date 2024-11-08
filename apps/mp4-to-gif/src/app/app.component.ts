import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import {
  DocumentActions,
  DocumentDataAccessModule,
  DocumentFacade,
} from '@mp4-to-gif/document/data-access';
import { DocumentOutCreateCmd } from '@mp4-to-gif/document/domain';
import { Actions, ofType } from '@ngrx/effects';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  merge,
  mergeMap,
  of,
  skip,
  switchMap,
  take,
  takeUntil,
  tap,
  timer,
} from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, DocumentDataAccessModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly sample$ = new BehaviorSubject<null | File>(null);
  readonly startAt$ = new BehaviorSubject<null | number>(null);
  readonly rps$ = new BehaviorSubject<number>(0);

  constructor(
    private readonly actions$: Actions,
    private readonly destoryRef: DestroyRef,
    private readonly httpClient: HttpClient,
    private readonly documentFacade: DocumentFacade
  ) {}

  ngOnInit(): void {
    this.fetchSample()
      .pipe(
        tap((_) => this.sample$.next(_)),
        takeUntilDestroyed(this.destoryRef)
      )
      .subscribe();

    merge(
      this.startAt$.pipe(mergeMap((_) => Array(5).fill(0))),
      this.actions$.pipe(
        ofType(
          DocumentActions.documentOutCreateSuccess,
          DocumentActions.documentOutCreateFailure
        )
      )
    )
      .pipe(
        tap((_) => this.documentOutCreate()),
        takeUntil(
          this.startAt$.pipe(
            skip(1),
            filter((_) => !_)
          )
        ),
        takeUntilDestroyed(this.destoryRef)
      )
      .subscribe();

    this.startAt$
      .pipe(
        switchMap((startAt) =>
          startAt
            ? combineLatest([
                this.documentFacade.successed$,
                timer(0, 1_000),
              ]).pipe(map((_) => _[0] / ((Date.now() - startAt) / 1_000)))
            : of(0)
        ),
        tap((_) => this.rps$.next(_)),
        takeUntilDestroyed(this.destoryRef)
      )
      .subscribe();
  }

  get documentErrored$() {
    return this.documentFacade.errored$;
  }

  get documentSuccessed$() {
    return this.documentFacade.successed$;
  }

  documentOutCreate() {
    this.sample$
      .pipe(
        take(1),
        tap((_) =>
          _
            ? this.documentFacade.documentOutCreate(
                new DocumentOutCreateCmd({ documentInFile: _ })
              )
            : null
        )
      )
      .subscribe();
  }

  onStart() {
    this.startAt$.next(Date.now());
  }

  onStop() {
    this.startAt$.next(null);
  }

  private fetchSample() {
    return this.httpClient
      .get('/sample1-10s.mp4', {
        responseType: 'arraybuffer',
      })
      .pipe(
        map((response: any) => {
          return new File([response], '/sample1-10s.mp4', { type: 'video/mp4' });
        })
      );
  }
}
