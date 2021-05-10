import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Directive({
  selector: '[appAuth]',
})
export class AuthDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private jwtService: JwtHelperService
  ) {}

  ngOnInit(): void {
    const hasAccess = !this.jwtService.isTokenExpired();
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
