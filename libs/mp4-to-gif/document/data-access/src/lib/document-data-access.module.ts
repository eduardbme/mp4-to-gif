import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import Effects from './+state/effects';
import Facades from './+state/facades';
import Services from './+state/services';
import { documentFeature } from './+state/reducers';

@NgModule({
  imports: [CommonModule],
  providers: [
    provideHttpClient(),
    provideState(documentFeature),
    provideEffects(Effects),
    Facades,
    Services,
  ],
})
export class DocumentDataAccessModule {}
