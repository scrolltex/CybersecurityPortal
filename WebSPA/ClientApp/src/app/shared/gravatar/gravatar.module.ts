import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GravatarDirective } from './gravatar.directive';

@NgModule({
  declarations: [GravatarDirective],
  imports: [CommonModule],
  exports: [GravatarDirective],
})
export class GravatarModule {}
