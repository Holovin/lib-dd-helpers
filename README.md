# Lib: DDHelpers

### Install
`npm i https://github.com/Holovin/lib-dd-helpers`

### Using
Default config file `config.json` (can be redefined via process env varibale `DD_CONFIG_FILE`)

#### Logger module
Config via `dd:log` section in config file.

Example:
```
{
  "dd": {
    "log": {
      "dir": 'mylogs/'
    }
  }  
}
```

##### Available params
| Key           | if default = 'true' | Description |
| ------------- | ------------------- | ----------- |
| `default`     |                     | Sets all dd:log keys as defualt
| `error`       | 'log_error.log'     | Filename for log file with errors
| `info`        | 'log_info.log'      | Filename for log file with info (and above) messages
| `all`         | 'log_all.log'       | Filename for log file with all messages
| `base`        | 'silly'             | Base log level for all loggers
| `console`     | 'verbose'           | Base log level for console output
| `dir`         | 'logs/'             | Directory for logs


 

