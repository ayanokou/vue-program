Set-Location .\server
mvn package
Set-Location ..

if($args.Contains("-d") -or $args.Contains("--detached")){
    Start-Process -FilePath "mh/MessageHandler.exe"
    Start-Sleep -Milliseconds 300
    java -jar server/target/demo-0.0.1-SNAPSHOT.jar -d
} else{
    java -jar server/target/demo-0.0.1-SNAPSHOT.jar
}