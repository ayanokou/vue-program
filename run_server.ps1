Set-Location .\server
mvn -D'maven.test.skip=true' package
java -D'java.library.path=src/main/resources' -jar target/demo-0.0.1-SNAPSHOT.jar