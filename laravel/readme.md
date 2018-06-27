<p align="center"><img src="https://laravel.com/assets/img/components/logo-laravel.svg"></p>

<p align="center">
<!-- <a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/d/total.svg" alt="Total Downloads"></a> -->
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/v/stable.svg" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/license.svg" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel attempts to take the pain out of development by easing common tasks used in the majority of web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, yet powerful, providing tools needed for large, robust applications.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Directory Structure

### The Root Directory




#### App Directory :

The app directory contains the core code of your application. however, almost all of the classes in your application will be in this directory.

###### Broadcasting Directory :
The Broadcasting directory contains all of the broadcast channel classes for your application. 

###### Console Directory :
The Console directory contains all of the custom Artisan commands for your application. 

###### Events directory :
The Events directory, as you might expect, houses event classes. Events may be used to alert other parts of your application that a given action has occurred, providing a great deal of flexibility and decoupling.

###### Exceptions Directory :
The Exceptions directory contains your application's exception handler and is also a good place to place any exceptions thrown by your application.

###### Http Directory :
The Http directory contains your controllers, middleware, and form requests. Almost all of the logic to handle requests entering your application will be placed in this directory.

###### Jobs Directory :
This directory does not exist by default, but will be created for you if you execute the make:job Artisan command. The Jobs directory houses the queueable jobs for your application. it's generally use for email sending or multiple mail sent at a time

###### Listeners Directory :
The Listeners directory contains the classes that handle your events. Event listeners receive an event instance and perform logic in response to the event being fired.

###### Mail Directory :
The Mail directory contains all of your classes that represent emails sent by your application. Mail objects allow you to encapsulate all of the logic of building an email in a single, simple class that may be sent using the Mail::send method.

###### Notifications Directory :
The Notifications directory contains all of the "transactional" notifications that are sent by your application, such as simple notifications about events that happen within your application.

###### Policies Directory :
he Policies directory contains the authorization policy classes for your application. Policies are used to determine if a user can perform a given action against a resource.

###### Providers Directory :
Service providers bootstrap your application by binding services in the service container, registering events, or performing any other tasks to prepare your application for incoming requests.

###### Rules Directory :
The Rules directory contains the custom validation rule objects for your application.





#### Bootstrap Directory :
The bootstrap directory contains the app.php file which bootstraps the framework. This directory also houses a cache directory which contains framework generated files for performance optimization such as the route and services cache files.


#### Config Directory :
The config directory, as the name implies, contains all of your application's configuration files. It's a great idea to read through all of these files and familiarize yourself with all of the options available to you.


#### Database Directory :
The database directory contains your database migrations, model factories, and seeds. If you wish, you may also use this directory to hold an SQLite database.


#### Public Directory :
This directory also houses your assets such as images, JavaScript, and CSS.

#### Resources Directory :
The resources directory contains your views as well as your raw, un-compiled assets such as LESS, SASS, or JavaScript. This directory also houses all of your language files.


#### Routes Directory :
The routes directory contains all of the route definitions for your application. By default, several route files are included with Laravel: web.php, api.php, console.php and channels.php.


#### Storage Directory :
The storage directory contains your compiled Blade templates, file based sessions, file caches, and other files generated by the framework.


#### Vendor Directory :
The vendor directory contains your Composer dependencies.