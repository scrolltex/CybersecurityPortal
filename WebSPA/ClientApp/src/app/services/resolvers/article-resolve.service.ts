import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Article } from '@app/models';
import { ArticleService } from '../article.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleResolveService implements Resolve<Article> {
  constructor(private articleService: ArticleService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Article | Observable<Article> | Promise<Article> {
    const id = route.paramMap.get('id');
    if (id == null) {
      throw new Error('Article id is null');
    }
    return this.articleService.getById(id);
  }
}
