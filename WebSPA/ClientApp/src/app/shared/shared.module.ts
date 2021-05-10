import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { GravatarModule } from './gravatar';
import { AuthDirective } from './auth.directive';

@NgModule({
  declarations: [AuthDirective],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, GravatarModule, AuthDirective],
})
export class SharedModule {}
