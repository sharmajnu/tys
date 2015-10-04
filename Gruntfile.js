

module.exports = function(grunt){
    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [  'webserver/app/home/*.js',
                        'webserver/app/list/*.js',
                        'webserver/app/test/*.js',
                        'webserver/app/upload/upload.*.js',
                        'webserver/app/upload/quiz.*.js'],
                dest: 'webserver/app/dist/controllers.js'
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat']);
}