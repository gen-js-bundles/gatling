var
  inquirer = require("inquirer"),
  fs = require('fs'),
  path = require('path'),
  gfile = require('gfilesync'),
  yaml = require('js-yaml');

module.exports = {
  do: function(data, callback) {

    var dependenciesChoices = [
      {
	name: "Test - JUnit - http://junit.org/",
	value: {
          groupId: "junit",
          artifactId: "junit",
          version: "4.12",
          scope: "test"
        },
        checked: true
      },
      {
	name: "Test - Mockito - http://www.mockito.org/",
	value: {
          groupId: "org.mockito",
          artifactId: "mockito-all",
          version: "1.10.19",
          scope: "test"
        }
      },{
      	name: "Test - Spring - https://github.com/spring-projects/spring-framework",
	value: {
          groupId: "org.springframework",
          artifactId: "spring-test",
          version: "4.1.5.RELEASE",
          scope: "test"
        }
      },{
        name: "MongoDB - MongoDB Java Driver - http://docs.mongodb.org/ecosystem/drivers/java",
	  value: {
          groupId: "org.mongodb",
          artifactId: "mongo-java-driver",
          version: "2.13.0"
        }
      },{
        name: "MongoDB - Morphia - https://github.com/mongodb/morphia",
        value: {
          groupId: "org.mongodb.morphia",
          artifactId: "morphia",
          version: "0.110"
        }
      },{
        name: "MongoDB - Jongo - http://jongo.org",
        value: {
          groupId: "org.jongo",
          artifactId: "jongo",
          version: "1.1"
        }
      },{
        name: "MongoDB - MongoJack - http://mongojack.org", 
        value: {
          groupId: "org.mongojack",
          artifactId: "mongojack",
          version: "2.3.0"
        }
      },{
        name: "MongoDB - Spring Data MongoDB - http://projects.spring.io/spring-data-mongodb", 
        value: {
          groupId: "org.springframework.data",
          artifactId: "spring-data-mongodb",
          version: "1.6.2.RELEASE"
        }
      },{
        name: "Data - JDBI - SQL convenience library - http://jdbi.org", 
        value: {
          groupId: "org.jdbi",
          artifactId: "jdbi",
          version: "2.59"
        }
      },{
        name: "Database driver - MySQL - http://dev.mysql.com/usingmysql/java", 
        value: {
          groupId: "mysql",
          artifactId: "mysql-connector-java",
          version: "5.1.34"
        }
      },{
        name: "Database driver - PostgreSQL - http://jdbc.postgresql.org", 
        value: {
          groupId: "org.postgresql",
          artifactId: "postgresql",
          version: "9.4-1201-jdbc41"
        }
      },{
        name: "Database driver - H2 - http://www.h2database.com", 
        value: {
          groupId: "com.h2database",
          artifactId: "h2",
          version: "1.4.185"
        }
      },{
        name: "Database driver - HSQLDB - http://dev.mysql.com/usingmysql/java/", 
        value: {
          groupId: "org.postgresql",
          artifactId: "postgresql",
          version: "9.4-1201-jdbc41"
        }
      },{
        name: "Database driver - Oracle - ojdbc14 - http://www.oracle.com/technology/software/tech/java/sqlj_jdbc", 
        value: {
          groupId: "com.oracle",
          artifactId: "ojdbc14",
          version: "10.2.0.4.0"
        }
      },{
        name: "Database driver - Elasticsearch - http://www.elasticsearch.org", 
        value: {
          groupId: "org.elasticsearch",
          artifactId: "elasticsearch",
          version: "1.4.4"
        }
      },{
        name: "Database driver - Redis - Jedis - https://github.com/xetorthio/jedis", 
        value: {
          groupId: "redis.clients",
          artifactId: "jedis",
          version: "2.6.2"
        }
      },{
        name: "Database driver - RabbitMQ - http://www.rabbitmq.com", 
        value: {
          groupId: "com.rabbitmq",
          artifactId: "amqp-client",
          version: "3.4.4"
        }
      },{
        name: "Web - webjars - AngularJS - http://jdbi.org", 
        value: {
          groupId: "org.webjars",
          artifactId: "angularjs",
          version: "1.3.14"
        }
      },{
        name: "Jsoup - http://jsoup.org/", 
        value: {
	  groupId: "org.jsoup",
	  artifactId: "jsoup",
	  version: "1.8.1"
        }
      },{
        name: "Apache HTTPComponents - HTTPClient - http://hc.apache.org/httpcomponents-client-ga/", 
        value: {
	  groupId: "org.apache.httpcomponents",
	  artifactId: "httpclient",
	  version: "4.4"
        }
      },{
        name: "Apache HTTPComponents - HTTPCore - http://hc.apache.org/httpcomponents-core-ga/", 
        value: {
	  groupId: "org.apache.httpcomponents",
	  artifactId: "httpcore",
	  version: "4.4"
        }
      }
    ];

    var questions = [
      {
        type: 'list',
        name: 'javaVersion',
        message: 'Which Java version ?',
        choices: [{
          name: '1.8',
          value: '1.8'
        },{
          name: '1.7',
          value: '1.7'
        },{
          name: '1.6',
          value: '1.6'
        },{
          name: '1.5',
          value: '1.5'
        }],
        default: '1.8'
      },
      {
        type: 'list',
        name: 'buildTool',
        message: 'Which build tool ?',
        choices: [{
          name: 'Maven',
          value: 'maven'
        },{
          name: 'Gradle',
          value: 'gradle'
        }],
        default: 'maven'
      },
      {
        type: 'list',
        name: 'packaging',
        message: 'Which packaging ?',
        choices: [{
          name: 'Jar',
          value: 'jar'
        },{
          name: 'War',
          value: 'war'
        }],
        default: 'jar'
      },
      {
        type: 'checkbox',
        name: 'dependenciesSelected',
        message: 'Which dependencies ?',
        choices: dependenciesChoices
      }
    ];
    inquirer.prompt(questions, function( answers ) {
      /*
      if(answers.buildTool == 'maven') {
        gfile.copy(
          path.join(__dirname,'../model/config.@maven.yml'),
          path.join(process.cwd(),'model/config.@maven.yml'));
      }
      if(answers.buildTool == 'gradle') {
        gfile.copy(
          path.join(__dirname,'../model/config.@gradle.yml'),
          path.join(process.cwd(),'model/config.@gradle.yml'));
      }
      */

      var data = gfile.loadYaml(path.join(process.cwd(),'Genjsfile.yml'));

      if(data.global == null) {
        data.global = {};
      }
      if(data.global.project == null) {
        data.global.project = {};
      }
      if(data.global.project.name == null) {
        data.global.project.name = 'myapp';
      }
      if(data.global.project.version == null) {
        data.global.project.version = '0.1';
      }
      if(data.global.project.description == null) {
        data.global.project.description = '';
      }

      if(data.global.maven == null) {
        data.global.maven = {};
      }
      if(data.global.maven.groupId == null) {
        data.global.maven.groupId = 'demo';
      }
      if(data.global.maven.artifactId == null) {
        data.global.maven.artifactId = 'myapp';
      }
      if(data.global.maven.packaging == null) {
        data.global.maven.packaging = answers.packaging
      }

      if(data.global.version == null) {
        data.global.version = {};
      }
      if(data.global.version.java == null) {
        data.global.version.java = answers.javaVersion;
      }
      
      if(data.global.build == null) {
        data.global.build = {};
      }
      data.global.build.tool = answers.buildTool;

      gfile.writeYaml(path.join(process.cwd(),'Genjsfile.yml'), data);

      var data = {
        dependencies: answers.dependenciesSelected
      };

      gfile.writeYaml(path.join(process.cwd(),'model','config.@build.yml'), data);

      if(callback) {
        callback();
      }
    });
  }
};
