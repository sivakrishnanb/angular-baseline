module.exports = function(grunt) {

var gruntConfig = grunt.file.readJSON('Gruntconfig.json');

grunt.initConfig({

cvars: gruntConfig.configVars,

  requirejs: {
    production: {
      options: {
          baseUrl: '<%= cvars.productionDir %>/scripts',
          mainConfigFile: '<%= cvars.productionDir %>/scripts/main.js',
          name: 'main',
          out: '<%= cvars.productionDir %>/scripts/scripts.min.js',
          preserveLicenseComments: false,
          paths: {
          requireLib: '../lib/require/require'
          },
          include: 'requireLib'
      }
    }
  },

 concat: {
    options: {
      separator: ' ',
    },
    production: {
      src: ['<%= cvars.productionDir %>/lib/bootstrap/css/bootstrap.min.css','<%= cvars.productionDir %>/lib/bootstrap/css/bootstrap-theme.min.css','<%= cvars.productionDir %>/lib/nvd3/nv.d3.min.css','<%= cvars.productionDir %>/lib/datepicker/datepicker.min.css','<%= cvars.productionDir %>/styles/preview.min.css','<%= cvars.productionDir %>/lib/jquery/jquery-ui.css','<%= cvars.productionDir %>/styles/base.css','<%= cvars.productionDir %>/styles/theme.css'],
      dest: '<%= cvars.productionDir %>/styles/styles.css',
    },
  },

  cssmin: {
    production: {
      files: [{
        expand: true,
        cwd: '<%= cvars.productionDir %>/',
        src: ['styles/styles.css'],
        dest: '<%= cvars.productionDir %>/',
        ext: '.min.css',
      }]
    }
  },


  copy: {
    production_default: {
      files: [
        {expand: true, src: ['*/**','!**/node_modules/**','!**/<%= cvars.productionDir %>/**','!**/grunt/**'], dest: '<%= cvars.productionDir %>/'},
        {src: ['grunt/production.config.js'], dest: '<%= cvars.productionDir %>/scripts/utility/config.js'},
        {src: ['index.html'], dest: '<%= cvars.productionDir %>/index.html'},
        {expand: true, flatten:true, src: ['lib/bootstrap/fonts/*.*'], dest: '<%= cvars.productionDir %>/fonts/'},
      ],
    },
    production: {
      files: [
        {expand: true, src: ['*/**','!**/node_modules/**','!**/<%= cvars.productionDir %>/**','!**/grunt/**'], dest: '<%= cvars.productionDir %>/'},
        {src: ['grunt/production.index.html'], dest: '<%= cvars.productionDir %>/index.html'},
        {src: ['grunt/production.config.js'], dest: '<%= cvars.productionDir %>/scripts/utility/config.js'},
        {expand: true, flatten:true, src: ['lib/bootstrap/fonts/*.*'], dest: '<%= cvars.productionDir %>/fonts/'},
      ],
    },
    change_to_cdn: {
      files: [
        {src: ['grunt/cdn-links.main.js'], dest: '<%= cvars.productionDir %>/scripts/main.js'},
        {src: ['grunt/cdn-production.index.html'], dest: '<%= cvars.productionDir %>/index.html'},
      ],
    },
  },
  

  htmlmin: { 
        production: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            files: [
            {
                expand: true,
                cwd: '<%= cvars.productionDir %>/',
                src: '*.html',
                dest: '<%= cvars.productionDir %>/',
                ext: '.html'
            },
            {
                expand: true,
                cwd: '<%= cvars.appview %>/',
                src: '**/*.html',
                dest: '<%= cvars.appview %>/',
                ext: '.html'
            },{
                expand: true,
                cwd: '<%= cvars.appsignup %>/',
                src: '*.html',
                dest: '<%= cvars.appsignup %>/',
                ext: '.html'
            }]
        },
        production_concatall: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            files: [
              {
                  expand: true,
                  cwd: '<%= cvars.productionDir %>/',
                  src: '*.html',
                  dest: '<%= cvars.productionDir %>/',
                  ext: '.html'
              },
            ]
        },
    },

    uglify: {
      production: {
        files: [{
          expand: true,
          cwd: '<%= cvars.productionDir %>/scripts',
          src: ['**/*.js','!scripts.min.js'],
          dest: '<%= cvars.productionDir %>/scripts'
        }]
      }
    },

    imagemin: {                          
      production: {                         
        files: [{
          expand: true,                  
          cwd: '<%= cvars.appimages %>/',                   
          src: ['**/*.{png,jpg,gif}'],   
          dest: '<%= cvars.appimages %>/'                  
        }]
      }
  },
    replace: {

      production_js: {
        src: ['<%= cvars.productionDir %>/scripts/main.js'],
        dest: '<%= cvars.productionDir %>/scripts/',             
        replacements: [
            {
              from: /urlArgs\s?:\s?\"v=?=([\d\.]+)"/,
              to: function (matchedWord) {
                
                return replaceVersions(matchedWord,getBuildVersion,'JS');

              }
            },
        ]
      },
      production_html: {
        src: ['<%= cvars.productionDir %>/scripts/main.js'],
        dest: '<%= cvars.productionDir %>/scripts/',             
        replacements: [{
          from: /htmlVersion=?="([\d\.]+)"/,
          to: function (matchedWord) {

            return replaceVersions(matchedWord,getBuildVersion,'HTMLs');

          }
        }]
      },
      production_indexhtml: {
        src: ['<%= cvars.productionDir %>/index.html'],
        dest: '<%= cvars.productionDir %>/index.html',             
        replacements: [
            {
              from: /\.html(\?v=[\d.]+)?\'/g,
              to: function (matchedWord) {
                return matchedWord.split(".html")[0]+'.html?v='+getProductionIndexhtmlVersion(getBuildVersion,'.html')+'\'';
              }
            }
        ]
      },
      production_indexjs: {
        src: ['<%= cvars.productionDir %>/index.html'],
        dest: '<%= cvars.productionDir %>/index.html',             
        replacements: [
            {
              from: /scripts.min.js(\?v=[\d.]+)?\"/,
              to: function (matchedWord) {
                    return matchedWord.split(".js")[0]+'.js?v='+getProductionIndexhtmlVersion(getBuildVersion,'.js')+'"';
              }
            }
        ]
      },
      production_indexcss: {
        src: ['<%= cvars.productionDir %>/index.html'],
        dest: '<%= cvars.productionDir %>/index.html',             
        replacements: [
          {
            from: /styles.min.css(\?v=[\d.]+)?\"/g,
            to: function (matchedWord) {
              return matchedWord.split(".css")[0]+'.css?v='+getProductionIndexhtmlVersion(getBuildVersion,'.css')+'"';
            }
          }
        ]
      },
      production_versions: {
        src: ['<%= cvars.productionDir %>/scripts/main.js'],
        dest: '<%= cvars.productionDir %>/scripts/',             
        replacements: [
            {
              from: /urlArgs\s?:\s?\"v=?=([\d\.]+)"/,
              to: function (matchedWord) {
                return replaceVersions(matchedWord,'getversion','JS');
              }
            },
            {
              from: /htmlVersion=?="([\d\.]+)"/,
              to: function (matchedWord) {
                return replaceVersions(matchedWord,'getversion','HTMLs');
              }
            }
        ]
      }
    }

});

function replaceVersions(matchedWord,buildVersion,types) {
  
  if(matchedWord && buildVersion && buildVersion!='getversion') {

    if(types=='HTMLs')
      return matchedWord.split("=")[0]+'="'+buildVersion+'"';
    else 
      return matchedWord.split("=")[0]+'='+buildVersion+'"';

  }else if(matchedWord && buildVersion && buildVersion=='getversion') {

    console.log('current '+types+' version :'+matchedWord); 
    return matchedWord;
  }else{

    console.log('No '+types+' Version specified replacing with this version :'+matchedWord); 
    return matchedWord;
  }

}

function getProductionIndexhtmlVersion(version,type) {

  var tempVersion = "";

  if(version){
    tempVersion = version;
  }else{
    console.log('No Version specified for ( '+type+' ) replacing with this version : 1.0'); 
    tempVersion = "1.0";
  }

  return tempVersion;
}

grunt.loadNpmTasks('grunt-contrib-requirejs');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-text-replace');

var getBuildVersion = grunt.option('build');

/*
grunt.registerTask('default', ['copy:production','replace:production_js','replace:production_html','replace:production_indexhtml','replace:production_indexjs','replace:production_indexcss','requirejs','concat','cssmin','htmlmin:production','uglify','imagemin']);
*/

grunt.registerTask('default', ['copy:production_default','replace:production_js','replace:production_html','replace:production_indexhtml','replace:production_indexjs','replace:production_indexcss','requirejs','concat','cssmin','htmlmin:production','uglify','imagemin']);

grunt.registerTask('getversion', ['replace:production_versions']);

grunt.registerTask('minifyonly', ['replace:production_js','replace:production_html','replace:production_indexhtml','replace:production_indexjs','replace:production_indexcss','requirejs','cssmin','htmlmin:production','uglify']);


grunt.registerTask('versiononly', ['replace:production_js','replace:production_html','replace:production_indexhtml','replace:production_indexjs','replace:production_indexcss']);

grunt.registerTask('versiononly-cdn', ['copy:change_to_cdn','replace:production_js','replace:production_html','replace:production_indexhtml','replace:production_indexjs','replace:production_indexcss']);

grunt.registerTask('concatall', ['copy:production','replace:production_js','replace:production_html','replace:production_indexhtml','replace:production_indexjs','replace:production_indexcss','requirejs','htmlmin:production_concatall']);

};
