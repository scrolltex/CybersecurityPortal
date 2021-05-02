import { NgModule } from '@angular/core';

import { MaterialModule } from './material.module';
import { GravatarModule } from './gravatar';

@NgModule({
  declarations: [],
  exports: [MaterialModule, GravatarModule],
})
export class SharedModule {}
