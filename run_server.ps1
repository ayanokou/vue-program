Set-Location .\server
mvn -D'maven.test.skip=true' package
Set-Location ..
java -D'java.library.path=server/src/main/resources' -jar server/target/demo-0.0.1-SNAPSHOT.jar