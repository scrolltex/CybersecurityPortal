import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { GravatarModule } from './gravatar';

@NgModule({
  declarations: [],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, GravatarModule],
})
export class SharedModule {}
