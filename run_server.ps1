param (
    [ValidateSet("attached", "detached", "jar", "mh")]
    [string]$Mode = "detached",
    [switch]$Help
)

function Build-Jar {
    Write-Host "Building jar file."
    Set-Location .\server
    mvn package
    Set-Location ..
}

function Run-MessageHandler {
    Write-Host "Running MessageHandler."
    Start-Process -FilePath "mh/MessageHandler.exe"
}

function Run-Jar{
    param (
        [Parameter(ValueFromRemainingArguments=$true)]
        [string[]]$Arguments
    )

    $jarPath = "server/target/demo-0.0.1-SNAPSHOT.jar"
    $javaCmd = "java -jar $jarPath $Arguments"

    Write-Host "Executing: $javaCmd"

    Invoke-Expression $javaCmd
}

function Show-Usage {
    $usage = @"
Usage: .\run_server.ps1 [-h|--help] [-m|--mode <mode>]

Options:
    -h, --help           Show this help message.
    -m, --mode <mode>    Set the mode:
                         - 'attached': Run jar embedded with mh.
                         - 'detached': Run jar and mh separately.
                         - 'jar': Run jar only.
                         - 'mh': Run mh only.
                         Default mode is 'detached'.
                         mh stands for MessageHandler.
"@
    Write-Host $usage
}

if ($Help) {
    Show-Usage
    exit 0
}

switch ($Mode) {
    "attached" {
        Write-Host "Running in attached mode."

        Build-Jar
        Run-Jar -a
    }
    "detached" {
        Write-Host "Running in detached mode."

        Build-Jar
        
        Run-MessageHandler
        Start-Sleep -Milliseconds 300
        Run-Jar
    }
    "jar" {
        Write-Host "Running in jar mode."

        Build-Jar
        Run-Jar
    }
    "mh" {
        Write-Host "Running in mh mode."

        Run-MessageHandler
    }
    default {
        Write-Host "Invalid mode: $Mode. Please choose from attached, detached, jar, or mh."
        exit 1
    }
}