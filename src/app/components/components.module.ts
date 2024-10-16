import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


@NgModule({
    declarations: [
  ],
    exports: [
        CommonModule,
        RouterModule,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: []
})
export class ComponentModule { }
