

module.exports = function(grunt){
    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [  'webserver/app/home/*.js',
                        'webserver/app/list/*.js',
                        //'webserver/app/test/*.js',
                        'webserver/app/upload/upload.*.js',
                        'webserver/app/upload/quiz.*.js',
                        'webserver/app/services/*.js',
                        'webserver/app/admin/user.list.controller.js',
                        'webserver/app/admin/user.admin.edit.controller.js'
                    ],

                dest: 'webserver/app/dist/controllers.js'
            },
        },

        watch:{
            files: ['webserver/app/**/*.js'],
            tasks: ['concat']
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat']);
}