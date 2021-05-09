import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { UserService } from '@app/services';
import { User } from '@app/models';

@Component({
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  user$?: Observable<User>;

  readonly tabs: { title: string; link: any[] }[] = [
    {
      title: 'Профиль',
      link: ['profile'],
    },
    {
      title: 'Статьи',
      link: ['articles'],
    },
    {
      title: 'Закладки',
      link: ['bookmarks'],
    },
  ];

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    this.user$ = this.route.paramMap.pipe(
      map((params) => params.get('userName') ?? ''),
      switchMap((userName) => this.userService.getByUserName(userName))
    );
  }
}
