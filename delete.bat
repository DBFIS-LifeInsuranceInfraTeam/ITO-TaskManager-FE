@echo off
for /f "tokens=1" %%i in ('gh run list --limit 1000') do (
    echo Deleting run ID: %%i
    gh run delete %%i --confirm
)
