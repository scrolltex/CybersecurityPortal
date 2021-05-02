import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { MD5 } from 'crypto-js';

@Directive({
  selector: '[appGravatar]',
})
export class GravatarDirective implements OnChanges {
  @Input('appGravatar') email = '';

  @Input() fallback: 'blank' | 'identicon' | 'mp' | 'monsterid' | 'retro' | 'robohash' | 'wavatar' = 'identicon';

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    this._update();
  }

  private _update(): void {
    const emailHash = MD5(this.email.trim().toLowerCase()).toString();
    this.el.nativeElement.src = `https://www.gravatar.com/avatar/${emailHash}?d=${this.fallback}`;
  }
}
