module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        cssmin: {
            build: {
                files: {
                    "public/assets/css/oca.min.css": "public/assets/css/oca.css"
                }
            }
        },
        uglify: {
            build: {
                files: {
                    "public/assets/js/oca.min.js": [
                        "public/assets/js/clipboard.min.js",
                        "public/assets/js/jquery.min.js",
                        "public/assets/js/oca.js"
                    ]
                }
            }
        },
        watch: {
            scripts: {
                files: ["public/assets/css/*.css", "public/assets/js/*.js"],
                tasks: ["default"],
                options: {
                    spawn: false,
                    event: ["all"]
                }
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.registerTask("default", ["cssmin", "uglify"]); 
};