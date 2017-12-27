module.exports = function(grunt) {
         grunt.initConfig({
            less: {
                development: {
                    options: {
                        paths: ["assets/css"]
                    },
                    files: {"styles.css": "less/index.less"}
                },
                production: {
                    options: {
                        paths: ["assets/css"],
                        cleancss: true
                    },
                    files: {"styles.css": "less/index.less"}
                }
            },
            watch: {
                styles: {
                    files: ['less/**/*.less'], // which files to watch
                    tasks: ['less'],
                    options: {
                        nospawn: true
                    }
                }
            }
        });
         grunt.loadNpmTasks('grunt-contrib-less');
         grunt.loadNpmTasks('grunt-contrib-watch');

         grunt.registerTask('default', ['less', 'watch']);
     };