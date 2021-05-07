import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Router } from '@angular/router';

import { ArticleService, CategoryService } from '@app/services';
import { CreateArticleModel } from '@app/models';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss'],
})
export class CreateArticleComponent implements OnInit {
  categories$ = this.categoryService.getAll();

  form: FormGroup<CreateArticleModel>;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private articleService: ArticleService
  ) {
    this.form = new FormGroup<CreateArticleModel>({
      categoryId: new FormControl(null!, Validators.required),
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  publish(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.value;
    this.articleService.create(value).subscribe((createdArticle) => {
      this.router.navigate(['/', 'article', createdArticle.id]);
    });
  }
}
