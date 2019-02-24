# [CreativeBulma Boilerplate](https://creativebulma.net/)
The official CreativeBulma Template boilerplate.

This project provides a starter-kit to ease your Bulma.io template development based on the last [Bulma.io](https://bulma.io) version, [Gulp](https://gulpjs.com/) as build processor and [Jekyll](https://jekyllrb.com/) to provide a demo site for your template.

![bulma logo](https://bulma.io/images/bulma-logo.png)
![sass logo](https://user-images.githubusercontent.com/10498583/31125541-e2a732e6-a848-11e7-959d-7d7b0c138124.jpg)
![gulp logo](https://user-images.githubusercontent.com/10498583/31125542-e2a78b88-a848-11e7-8ac5-c396f46e811f.jpg)
![browsersync logo](https://user-images.githubusercontent.com/10498583/31125540-e2a6eed0-a848-11e7-817a-69c5619f772a.jpg)

## Requirements
This project requires you to have a installation of [nodejs](https://nodejs.org/en/) with [npm](https://www.npmjs.com/get-npm)
This project also requires you to have global installations of [gulp](http://gulpjs.com/).
```
# Install gulp globally
npm install -g gulp
```

## Quick Start
```
# 1 Clone this repo
git clone https://github.com/CreativeBulma/Boilerplate.git

# 2 Navigate into the repo directory
cd Boilerplate

# 3 Install all node packages
npm install
```

## Build
The build process consists of numerous Gulp tasks that work together to optimize your template.
``` bash
# To run the build process, run the Gulp build script.
gulp build

# To run the styles build process alone.
gulp build:styles

# To run the scripts build process alone.
gulp build:scripts

# Run a build and test the template with the demo site.
gulp demo
```

## File structure
|-- CreativeBulma Boilerplate folder
    |-- demo
    |-- dist
    |-- src
    |-- gruntfile.js
    |-- package.json
    |-- README.md

## Test
The test process consists of generating the Jekyll demo site and launch the local server.
``` bash
# Run a build and test the template with the demo site.
gulp demo
```

## License
This project is licensed under the MIT license, Copyright (c) 2018 [CreativeBulma](https://creativebulma.net).

For more information see `LICENSE.md`.
