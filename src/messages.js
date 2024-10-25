const messages = {
  en: {
    'doc.title': 'SmartThing',
    'doc.panel': 'Control panel',
    'doc.dashboard': 'Dashboard',
    'doc.device.settings': 'Device settings',
    'doc.device.logs': 'Device logs',
    'doc.device.ota': 'Arduino OTA',
    gateway: 'Gateway: {gateway}',
    'gateway.panel.devices': 'Devices',
    'gateway.panel': 'Control panel for {device}',
    'gateway.cloud.auth.conn.token': 'Connection token',
    'gateway.cloud.auth.url': 'Cloud url',
    'gateway.cloud.auth.token': 'Auth token',
    'gateway.cloud.auth.connect': 'Connect',
    'gateway.cloud.conn.status': `Cloud: {
      status, select,
      NOT_CONNECTED {not connected}
      CONNECTING {connecting...}
      CONNECTED {connected}
      CONNECTION_LOST {connection lost}
      DISCONNECTED {disconnected}
      FAILED_TO_CONNECT {failed to connect}
      RECONNECTING {reconnnecting...}
      other {{status}}
    }`,
    'gateway.cloud.conn.status.title': 'Cloud connection status',
    'gateway.cloud.conn.failed': 'Failed to connect',
    'gateway.cloud.disconnect.confirm': 'Are you sure?',
    'gateway.cloud.disconnect.failed': 'Failed to disconnect',
    'gateway.cloud.logout.confirm': 'Are you sure?',
    'gateway.cloud.logout.success': 'Loged out',
    'gateway.cloud.logout.error': 'Failed to log out',
    'gateway.cloud.info': 'Cloud information',
    'gateway.cloud.info.missing': 'Cloud was not connected yet',
    'gateway.cloud.info.gateway.name': 'Gateway name',
    'gateway.cloud.info.gateway.description': 'Gateway description',
    'gateway.cloud.info.user': 'User',
    'gateway.cloud.info.gateway.id': 'Gateway id',
    'gateway.cloud.config': 'Cloud connection config',
    'gateway.cloud.config.url': 'Url',
    'gateway.cloud.reconnect': 'Reconnect',
    'gateway.cloud.disconnect': 'Disconnect',
    'gateway.cloud.add.token': 'Add cloud token',
    'gateway.edit.button': `{
      action, select,
      update {Update}
      create {Create}
      other {{ action }}
    }`,
    'gateway.edit.validation.name.blank': "Gateway name can't be blank!",
    'gateway.edit.validation.name.long': 'Name is too long!',
    'gateway.edit.validation.name.long.desc': 'Max name length - {len} symbols',
    'gateway.edit.name': 'Name',
    'gateway.edit.description': 'Description',
    'gateway.item.save.success': 'Gateway info updated',
    'gateway.item.save.error': 'Failed to update gateway',
    'gateway.item.delete.confirm': 'Are you sure you want to delete gateway {name}?',
    'gateway.item.delete.success': 'Gateway was deleted',
    'gateway.item.delete.error': 'Failed to delete gateway',
    'gateway.item.token.gen.success': 'Token generated',
    'gateway.item.token.gen.error': 'Failed to generate gateway token',
    'gateway.item.token.validation.url.blank': "Cloud url can't be blank",
    'gateway.item.token.delete.confirm':
      'Are you sure? This action will delete token and disconnect gateway from cloud!',
    'gateway.item.token.delete.success': 'Token deleted',
    'gateway.item.token.delete.error': 'Failed to logout gateway',
    'gateway.item.status': `{
      status, select,
      true {Online}
      false {Offline}
      other {error}
    }`,
    'gateway.item.button.edit': 'Edit',
    'gateway.item.button.delete': 'Delete',
    'gateway.item.button.token.delete': 'Delete token',
    'gateway.item.button.token.gen': 'Generate token',
    'gateway.item.connection.token': 'Connection token',
    'gateway.item.cloud.url': 'Cloud url',
    'gateway.item.auth.token': 'Auth token',
    'gateway.item.auth.connection.token': "Gateway's connection token",
    'gateway.select.offline': 'Gateway is offline!',
    'gateway.select.offline.desc': "Can't open control panel of offline gateway",
    'gateway.create.success': 'Gateway created',
    'gateway.create.error': 'Failed to create gateway',
    'gateway.create.button': 'Create gateway',
    'gateway.selector.title': 'Select gateway',
    'device.logs.columns': `{
      column, select,
      device {Device}
      date {Date}
      level {Level}
      msg {Message}
      tag {Tag}
      other {{ column }}
    }`,
    'device.unreachable': 'Device is unreachable',
    'device.item.name': 'Name: {name}',
    'device.item.type': 'Type: {type}',
    'device.item.ip': 'Ip: {ip}',
    'device.item.board': 'Board: {board, select, undefined {Unknown} other {{board}}}',
    'device.tabs': `{
      tab, select,
      info {Information}
      actions {Actions}
      sensors {Sensors}
      states {States}
      config {Configuration}
      metrics {Metrics}
      danger {DangerZone}
      other {{tab}}
    }`,
    'device.settings.editor.name.empty': "Name can't be empty!",
    'device.settings.editor.name.empty.desc': 'Insert settings name',
    'device.settings.editor.setting.empty': "Settings can't be empty!",
    'device.settings.editor.setting.empty.desc': 'Insert settings json',
    'device.settings.editor.updated': 'Settings updated!',
    'device.settings.editor.created': 'Settings created!',
    'device.settings.editor.error': 'Error occured!',
    'device.settings.editor.delete.confirm':
      'This action will delete saved settings permanently. Are you sure?',
    'device.settings.editor.delete.success': 'Settings deleted',
    'device.settings.editor.json.parse.error': 'JSON parse failed',
    'device.settings.editor.export.success': 'Export to  {name} finished!',
    'device.settings.editor.export.success.desc': 'Device will restart now',
    'device.settings.editor.name': 'Name',
    'device.settings.editor.title': 'Settings',
    'device.settings.editor.button': `{
      action, select,
      update {Update}
      create {Create}
      delete {Delete}
      export {Export to device}
      import {Import from device}
      other {{action}}
    }`,
    'device.settings.editor.select.device': 'Select device',
    'device.settings.manager.add': 'Add new settings',
    'device.settings.manager.menu.header': 'Saved devices settings',
    'device.actions.call.succes': 'Done',
    'device.actions.call.error': 'Failed to execute action {action}',
    'device.actions.fetch.error': 'Failed to fetch device actions',
    'device.actions.title': `System name: {name}\n{
      callDelay, select,
      0 {}
      other {Call delay: {callDelay}\nLast scheduled call: {lastCall}}
    }`,
    'device.actions.delay.validation.error': `Delay can't be negative`,
    'device.actions.delay.disable.confirm':
      'Are you sure you want to disable action scheduled call?',
    'device.actions.delay.update.success': `{
      callDelay, select,
      0 {Delay disabled}
      other {Delay updated}
    }`,
    'device.actions.delay.update.error': 'Failed to update delay',
    'device.actions.delay.title': 'Action scheduled call delay',
    'device.actions.delay.label': 'Call action every (ms)',
    'device.actions.delay.save': 'Save',
    'device.actions.delay.disable': 'Disable',
    'device.actions.empty': 'No actions configured',
    'device.config.button.delete.all': 'Delete all values',
    'device.config.button.save': 'Save',
    'device.config.delete.confirm': 'Are you sure you want to delete all configuration values?',
    'device.config.empty.entries': 'No config entries configured',
    'device.config.field.title': `Sytem name: {name}\nValue type: {type}`,
    'device.info.name': 'Device name',
    'device.info.name.error.empty': "Name can't be empty!",
    'device.info.name.save': 'save',
    'device.info.type': 'Device type',
    'device.info.ip': 'Ip address',
    'device.info.board': 'Board',
    'device.info.version': 'Firmware version',
    'device.info.smt.version': 'SmartThing version',
    'device.info.chip.model': 'Chip model',
    'device.info.chip.revision': 'Chip revision',
    'device.hooks.menu.item.title': 'Click to open hooks',
    'device.hooks.select.to.manage': 'Select {type} to manage hooks',
    'device.hooks.title': 'Hooks',
    'device.hooks.button.add': 'Add hook of type ',
    'device.metrics.updatime': `
      {days, select, 0 {} other {{days} days}}
      {hours, select, 0 {} other {{hours} hours}}
      {minutes, select, 0 {} other {{minutes} minutes}}
      {seconds, select, 0 {} other {{seconds} seconds}}
    `,
    'hooks.disabled': 'Hooks feature disabled in this build',
    'device.hooks.empty': 'No hooks added yet',
    'device.hook.validation.error': 'Validation failed',
    'device.hook.validation.error.desc': 'This fields cannot be empty: {fields}',
    'device.hook.delete.confirm': 'Are you sure you wan to delete hook {id}?',
    'device.hook.readonly': 'Readonly',
    'device.hook.test.it': 'Make a test hook call',
    'device.hook.test.label': 'Value to pass in hook (optional)',
    'device.hook.test.button': 'Test it!',
    'device.hook.test.success': 'Hook called successfully!',
    'device.hook.test.error': 'Failed to call hook',
    '': 'Sensors values',
    'device.sensors.empty': 'No sensors configured',
    'device.states.empty': 'No states configured',
    'devices.search': 'Found devices',
    'devices.search.load.error': 'Failed to load found devices',
    'devices.search.lost': 'Device {device} lost connection',
    'devices.search.found': 'Device {device} came back online',
    'devices.search.empty': 'No devices found',
    'devices.search.in.progress': 'Searching...',
    'devices.search.disabled': 'Search disabled',
    'devices.search.disabled.title': 'This system does not support search mechanism',
    'devices.saved': 'Saved devices',
    'devices.saved.empty': 'No devices added yet',
    'devices.saved.load.error': 'Failed to load saved devices',
    'devices.saved.menu.update': 'Update',
    'devices.saved.menu.delete': 'Delete',
    'devices.saved.menu.delete.confirm': 'Are you sure?',
    'devices.saved.menu.update.success': 'Device info updated!',
    'devices.saved.menu.delete.success': 'Device deleted!',
    'devices.saved.menu.update.error': 'Failed to update saved device info',
    'devices.saved.menu.delete.error': 'Failed to delete device',
    'devices.saved.plus.title': 'Add device by ip',
    'devices.saved.add.title': 'Add device',
    'devices.saved.add.button': 'add',
    'devices.saved.add.input.ip': 'Device ip',
    'devices.saved.add.success': 'Added new device!',
    'devices.saved.add.success.desc': 'Name: {name}, type: {type}',
    'devices.saved.add.error': 'Failed to add device',
    'cloud.auth.lprequired': 'Login and password are required!',
    'cloud.auth.logout.confirm': 'Are you sure?',
    'cloud.auth.info.user.id': 'id: {id}',
    'cloud.auth.info.user.login': 'login: {login}',
    'dashboard.load.error': 'Failed to load dashboard',
    'dashboard.group.values.load.error': 'Failed to load values',
    'dashboard.group.values.update.error': 'Failed to update values',
    'dashboard.group.edit.title': 'Edit group {name}',
    'dashboard.groups.empty': 'No groups added yet',
    'dashboard.group.add.new': 'Add new group',
    'dashboard.group.update.title':
      'Click to force update\nAuto update every {updateDelay}s\nLast update {count}s ago',
    'dashboard.group.device.title': 'Group for device:\nname: {name}\nip: {ip}\ntype: {type}',
    'dashboard.group.delete.confirm': 'Are you sure?',
    'dashboard.group.delete.success': 'Group deleted',
    'dashboard.group.delete.error': 'Failed to delete group',
    'dashboard.group.edit': 'Edit',
    'dashboard.group.delete': 'Delete group',
    'dashboard.group.add.values': 'Add values to display',
    'dashboard.group.create.select.device': 'Select device',
    'dashboard.group.create.error.exists': 'Group for this device already exists',
    'dashboard.group.create.success': 'Create new group for device {name}',
    'dashboard.group.create.error': 'Failed to create group',
    'dashboard.group.edit.success': 'Group updated',
    'dashboard.group.edit.error': 'Failed to update group',
    'dashboard.group.edit.columns': `{
      column, select,
      type {type}
      name {name}
      units {units}
      other {{column}}
    }`,
    'dashboard.group.edit.types': `{
      value, select,
      sensor {sensor}
      state {state}
      other {{value}}
    }`,
    'dashboard.group.edit.update.delay': 'Update delay (ms)',
    'dashboard.group.edit.save': 'Save',
    'dashboard.group.edit.close.confirm': 'All unsaved changes will be lost, close dialog?',
    'dashboard.group.edit.observables': 'Sensors and states',
    'dashboard.group.edit.actions': 'Actions',
    'dashboard.group.edit.config': 'Settings',
    'dashboard.group.edit.add.action': 'Add action',
    'dashboard.group.edit.add.observables': 'Add sensors or states',
    'dashboard.group.edit.validation.error': 'Please fill required fields',
    'dashboard.value.last.update.data': 'Last update: {date}',
    'dashboard.value.last.update.error': 'Value not found in device response',
    'danger.title': 'Please, be careful with this actions!',
    'danger.restart.confirm': 'This action will restart device right now! Are u sure?',
    'danger.restart.success': 'Device is restarting',
    'danger.restart.success.timeout': 'Device should restart now',
    'danger.restart.success.timeout.desc': 'Got a timeout exception, but device should restart now',
    'danger.restart.error': 'Failed to restart device',
    'danger.wipe.confirm': `{
      step, select,
      1 {THIS ACTIONS WILL DELETE ALL SETTINGS FROM DEVICE!}
      2 {THERE IS NO WAY TO RESTORE THEM AFTER THIS ACTION!}
      3 {THIS IS LAST YOUR LAST CHANCE}
      other {}
    }`,
    'danger.wipe.success': 'Settings wiped',
    'danger.wipe.success.desc': 'Device is gonna restart now, please wait',
    'danger.wipe.success.timeout': 'Device should restart now',
    'danger.wipe.success.timeout.desc': 'Got a timeout exception, but device should restart now',
    'danger.wipe.error': 'Failed to wipe',
    'danger.button.restart': 'Restart',
    'danger.button.wipe': 'Wipe all device settings',
    'ota.load.saved.error': 'Failed to load saved firmwares',
    'ota.load.running.error': 'Failed to load active uploads',
    'ota.saved.header': 'Availibale firmwares',
    'ota.running.header': 'Active firmware uploads',
    'ota.add.header': 'Add new firmware',
    'ota.add.button': 'Add firmware',
    'ota.add.supported.error': 'Failed to load supported boards',
    'ota.add.success': 'Firmware added',
    'ota.add.error': 'Failed to add firmware',
    'ota.firmware.info.board': 'Board',
    'ota.firmware.info.type': 'Type',
    'ota.firmware.info.version': 'Version',
    'ota.firmware.info.file': 'Firmware file',
    'ota.edit.header': 'Edit firmware info',
    'ota.edit.button': 'Save changes',
    'ota.edit.succes': 'Firmware info updated',
    'ota.edit.error': 'Failed to update firmware info',
    'ota.upload.confirm':
      'Are u sure u want to upload {firmwareType} [{firmwareVersion}] ' +
      'to devices: {deviceName}?',
    'ota.upload.success': 'Firmware upload to {deviceName} started',
    'ota.upload.error': 'Failed to start upload to {deviceName}',
    'ota.delete.confirm':
      "Are you sure you want to delete this firmware? THis action can't ve reversed!",
    'ota.delete.success': 'Firmware deleted',
    'ota.delete.error': 'Failed to delete firmware',
    'ota.firmware.menu.edit': 'Edit',
    'ota.firmware.menu.delete': 'Delete',
    'ota.firmware.menu.upload': 'Upload',
    'ota.firmware.menu.download': 'Download',
    'ota.upload.to': 'Upload to',
    'ota.upload.block.firmware': 'Firmware',
    'ota.upload.block.device': 'Device',
    'ota.upload.abort': 'Abort upload',
    'ota.upload.abort.confirm': 'Firmware upload to {device} will be aborted, are you sure?',
    'ota.upload.abort.success': 'Firmware upload aborted',
    'ota.upload.abort.error': 'Failed to abort firmware upload',
    'ota.upload.status': `Status: {
      status, select,
      STARTED {starting upload}
      INVITATION {invitation send}
      INVITATION_FAILED {invitation failed}
      INVITATION_ACCEPTED {invitation accepted}
      FIRMWARE_TRANSFER {transfering firmware}
      FIRMWARE_TRANSFER_FAILED {transfer failed}
      FIRMWARE_TRANSFER_CONFIRMATION {transfer finishing}
      FIRMWARE_TRANSFER_FINISHED {transfer finished}
      FINISHED {upload finished}
      ABORTED {upload aborted}
      other {{status}}
    }`,
    login: 'Login',
    password: 'Password',
    'log.in': 'Log in',
    'log.out': 'Log out',
    error: `{ type, select,
      access_denied {Access denied}
      other { An error has occurred }
    }`
  },
  ru: {
    'doc.title': 'SmartThing',
    'doc.panel': 'Панель управления',
    'doc.dashboard': 'Дашборд',
    'doc.device.settings': 'Настройки устройств',
    'doc.device.logs': 'Логи устройств',
    'doc.device.ota': 'Ardunio OTA',
    gateway: 'Маршрутизатор: {gateway}',
    'gateway.panel.devices': 'Устройства',
    'gateway.panel': 'Панель управления {device}',
    'gateway.cloud.auth.conn.token': 'Токен подключения',
    'gateway.cloud.auth.url': 'Url облака',
    'gateway.cloud.auth.token': 'Авторизационный токен',
    'gateway.cloud.auth.connect': 'Подключиться',
    'gateway.cloud.conn.status': `Облако: {
      status, select,
      NOT_CONNECTED {не подключено}
      CONNECTING {подключение...}
      CONNECTED {подключено}
      CONNECTION_LOST {соединение потеряно}
      DISCONNECTED {отключено}
      FAILED_TO_CONNECT {ошибка подключения}
      RECONNECTING {переподключение...}
      other {{status}}
    }`,
    'gateway.cloud.conn.status.title': 'Статус подключения к облачному сервису',
    'gateway.cloud.conn.failed': 'Ошибка подключения',
    'gateway.cloud.disconnect.confirm': 'Вы уверены?',
    'gateway.cloud.disconnect.failed': 'Произошла ошибка при отключении',
    'gateway.cloud.logout.confirm': 'Вы уверены?',
    'gateway.cloud.logout.success': 'Успешно',
    'gateway.cloud.logout.error': 'Не удалось выйти',
    'gateway.cloud.info': 'Информация об облаке',
    'gateway.cloud.info.missing': 'Облако еще не было подключено',
    'gateway.cloud.info.gateway.name': 'Название маршрутизатора',
    'gateway.cloud.info.gateway.description': 'Описание маршрутизатора',
    'gateway.cloud.info.user': 'Пользователь',
    'gateway.cloud.info.gateway.id': 'Id маршрутизатора',
    'gateway.cloud.config': 'Адрес облака',
    'gateway.cloud.config.url': 'Url',
    'gateway.cloud.reconnect': 'Переподключиться',
    'gateway.cloud.disconnect': 'Отключиться',
    'gateway.cloud.add.token': 'Добавить токен облака',
    'gateway.edit.button': `{
      action, select,
      update {Обновить}
      create {Создать}
      other {{ action }}
    }`,
    'gateway.edit.validation.name.blank': 'Имя маршрутизатора не может быть пустым!',
    'gateway.edit.validation.name.long': 'Имя слишком длинное!',
    'gateway.edit.validation.name.long.desc': 'Максимальная длина имени - {len} символов',
    'gateway.edit.name': 'Имя',
    'gateway.edit.description': 'Описание',
    'gateway.item.save.success': 'Данные маршрутизатора обновлены',
    'gateway.item.save.error': 'Не удалось обновить данные маршрутизатора',
    'gateway.item.delete.confirm': 'Вы уверены, что хотите удалить маршрутизатор {name}?',
    'gateway.item.delete.success': 'Маршрутизатор удален',
    'gateway.item.delete.error': 'Не удалось удалить маршрутизатор',
    'gateway.item.token.gen.success': 'Токен сгенерирован',
    'gateway.item.token.gen.error': 'Не удалось сгенерировать токен для маршрутизатора',
    'gateway.item.token.validation.url.blank': 'Url облака не может быть пустым',
    'gateway.item.token.delete.confirm':
      'Вы уверены? Данное действие удалит токен и отключит маршрузитор от облака.',
    'gateway.item.token.delete.success': 'Токен удален',
    'gateway.item.token.delete.error': 'Не удалось удалить токен',
    'gateway.item.status': `{
      status, select,
      true {В сети}
      false {Не в сети}
      other {error}
    }`,
    'gateway.item.button.edit': 'Редактировать',
    'gateway.item.button.delete': 'Удалить',
    'gateway.item.button.token.delete': 'Удалить токен',
    'gateway.item.button.token.gen': 'Сгенерировать токен',
    'gateway.item.connection.token': 'Токен подключения',
    'gateway.item.cloud.url': 'Адрес облака',
    'gateway.item.auth.token': 'Токен авторизации',
    'gateway.item.auth.connection.token': 'Токен подключения маршрутизатора',
    'gateway.select.offline': 'Маршрутизатор не в сети!',
    'gateway.select.offline.desc':
      'Нельзя открыть панель управления маршрутизатора, если он не в сети.',
    'gateway.create.success': 'Маршрутизатор создан',
    'gateway.create.error': 'Не удалось создать маршрутизатор',
    'gateway.create.button': 'Создать маршрутизатор',
    'gateway.selector.title': 'Маршрутизаторы',
    'device.logs.columns': `{
      column, select,
      device {Устройство}
      date {Дата}
      level {Уровень}
      msg {Сообщение}
      tag {Тег}
      other {{ column }}
    }`,
    'device.unreachable': 'Устройство не доступно',
    'device.item.name': 'Имя: {name}',
    'device.item.type': 'Тип: {type}',
    'device.item.ip': 'Ip: {ip}',
    'device.item.board': 'Платформа: {board, select, undefined {Неизвестно} other {{board}}}',
    'device.tabs': `{
      tab, select,
      info {Информация}
      actions {Действия}
      sensors {Сенсоры}
      states {Состояния}
      config {Конфигурация}
      metrics {Метрики}
      danger {Опасная зона}
      other {{tab}}
    }`,
    'device.settings.editor.name.empty': 'Название не может быть пустым',
    'device.settings.editor.name.empty.desc': 'Введите название настроек',
    'device.settings.editor.setting.empty': 'Настройки не могут быть пустыми',
    'device.settings.editor.setting.empty.desc': 'Вставьте JSON настроек',
    'device.settings.editor.updated': 'Настройки обновлены!',
    'device.settings.editor.created': 'Настройки сохранены!',
    'device.settings.editor.error': 'Произошла ошибка!',
    'device.settings.editor.delete.confirm':
      'Данное действие удалит данные настройки навсегда. Вы уверены?',
    'device.settings.editor.delete.success': 'Настройки удалены',
    'device.settings.editor.json.parse.error': 'Ошибка парсинга JSON',
    'device.settings.editor.export.success': 'Экспорт на {name} завершен!',
    'device.settings.editor.export.success.desc': 'Устройство сейчас перезапустится',
    'device.settings.editor.name': 'Название',
    'device.settings.editor.title': 'Настройки',
    'device.settings.editor.button': `{
      action, select,
      update {Обновить}
      create {Создать}
      delete {Удалить}
      export {Экспорт на устройство}
      import {Импорт с устройства}
      other {{action}}
    }`,
    'device.settings.editor.select.device': 'Выберите устройство',
    'device.settings.manager.add': 'Добавить',
    'device.settings.manager.menu.header': 'Сохраненный настройки устройств',
    'device.actions.call.succes': 'Выполнено',
    'device.actions.call.error': 'Не удалось выполнить действие {action}',
    'device.actions.fetch.error': 'Не удалось получить список действий устройства',
    'device.actions.title': `Системное имя: {name}\n{
      callDelay, select,
      0 {}
      other {Пауза между вызовами: {callDelay}\nПоследний вызов: {lastCall}}
    }`,
    'device.actions.delay.validation.error': `Пауза не может быть отрицательной`,
    'device.actions.delay.disable.confirm':
      'Вы уверены, что хотите отключить плановый вызов действия?',
    'device.actions.delay.update.success': `{
      callDelay, select,
      0 {Плановый вызов был отключен}
      other {Пауза была обновлена}
    }`,
    'device.actions.delay.update.error': 'Не удалось обновить паузу',
    'device.actions.delay.title': 'Плановый вызов действия',
    'device.actions.delay.label': 'Вызывать действия каждые (мс)',
    'device.actions.delay.save': 'Сохранить',
    'device.actions.delay.disable': 'Отключить',
    'device.actions.empty': 'Нет настроенных действий',
    'device.config.button.delete.all': 'Удалить все значения',
    'device.config.button.save': 'Сохранить',
    'device.config.delete.confirm': 'Вы уверены, что хотите удалить все значения?',
    'device.config.empty.entries': 'Нет настроенных полей в конфигурации',
    'device.config.field.title': `Системное название: {name}\nТип данных: {type}`,
    'device.info.name': 'Имя устройства',
    'device.info.name.error.empty': 'Имя не может быть пустым!',
    'device.info.name.save': 'сохранить',
    'device.info.type': 'Тип устройства',
    'device.info.ip': 'Ip адрес',
    'device.info.board': 'Платформа',
    'device.info.version': 'Версия прошивки',
    'device.info.smt.version': 'Версия SmartThing',
    'device.info.chip.model': 'Модель чипа',
    'device.info.chip.revision': 'Ревизия чипа',
    'device.hooks.menu.item.title': 'Нажмите для открытия хуков',
    'device.hooks.select.to.manage': `Выберите {
      type, select,
      sensor {сенсор}
      state {состояние}
      other {{type}}
    } для редактирования хуков`,
    'device.hooks.title': 'Хуки',
    'device.hooks.button.add': 'Добавить хук типа ',
    'device.metrics.updatime': `
      {days, select, 0 {} other {{days} дней}}
      {hours, select, 0 {} other {{hours} часов}}
      {minutes, select, 0 {} other {{minutes} минут}}
      {seconds, select, 0 {} other {{seconds} секунд}}
    `,
    'hooks.disabled': 'Хуки отключены в данном билде',
    'device.hooks.empty': 'Нет добавленных хуков',
    'device.hook.validation.error': 'Ошибка валидации',
    'device.hook.validation.error.desc': 'Эти поля не могут быть пустыми: {fields}',
    'device.hook.delete.confirm': 'Вы уверены, что хотите удалить хук {id}?',
    'device.hook.readonly': 'Только для чтения',
    'device.hook.test.it': 'Сделать тестовый вызов хука',
    'device.hook.test.label': 'Значение для передачи в хук (оционально)',
    'device.hook.test.button': 'Протестировать!',
    'device.hook.test.success': 'Хук успешно вызван',
    'device.hook.test.error': 'Не удалось вызвать хук',
    'device.sensors.empty': 'Нет настроенных сенсоров',
    'device.states.empty': 'Нет настроенных состояний',
    'devices.search': 'Найденные устройства',
    'devices.search.load.error': 'Не удалось загрузить найденные устройства',
    'devices.search.lost': 'Устройство {device} отключилось от сети',
    'devices.search.found': 'Устройство {device} снова в сети!',
    'devices.search.empty': 'Устройства не найдены!',
    'devices.search.in.progress': 'Поиск...',
    'devices.search.disabled': 'Поиск отключен',
    'devices.search.disabled.title': 'Данная система не поддерживает механизм поиска устройств',
    'devices.saved': 'Сохраненные устройства',
    'devices.saved.empty': 'Нет сохраненных устройств',
    'devices.saved.load.error': 'Не удалось загрузить сохраненные устройства',
    'devices.saved.menu.update': 'Обновить',
    'devices.saved.menu.delete': 'Удалить',
    'devices.saved.menu.delete.confirm': 'Вы уверены?',
    'devices.saved.menu.update.success': 'Информация об устройстве обновлена!',
    'devices.saved.menu.delete.success': 'Устройство удалено',
    'devices.saved.menu.update.error': 'Не удалось обновить инфомарцию об устройстве',
    'devices.saved.menu.delete.error': 'Не удалось удалить устройство',
    'devices.saved.plus.title': 'Добавить устройство по ip',
    'devices.saved.add.title': 'Добавить устройство',
    'devices.saved.add.button': 'добавить',
    'devices.saved.add.input.ip': 'Ip устройство',
    'devices.saved.add.success': 'Добавлено новое устройство!',
    'devices.saved.add.success.desc': 'Имя: {name}, тип: {type}',
    'devices.saved.add.error': 'Не удалось добавить новое устройство',
    'cloud.auth.lprequired': 'Введите логин и пароль!',
    'cloud.auth.logout.confirm': 'Вы уверены?',
    'cloud.auth.info.user.id': 'id: {id}',
    'cloud.auth.info.user.login': 'логин: {login}',
    'dashboard.load.error': 'Ну удалось загрузить дашбоард',
    'dashboard.group.values.load.error': 'Не удалось загрузить значения',
    'dashboard.group.values.update.error': 'Не удалось обновить значения',
    'dashboard.group.edit.title': 'Редактировать группу {name}',
    'dashboard.groups.empty': 'Пока еще не было добавлено групп',
    'dashboard.group.add.new': 'Добавить новую группу',
    'dashboard.group.update.title':
      'Нажмите для принудительного обновления\nАвтоматическое обновление каждые {updateDelay}сек\nПоследнее обновление {count}сек назад',
    'dashboard.group.device.title': 'Группа для устройства:\nимя: {name}\nip: {ip}\nтип: {type}',
    'dashboard.group.delete.confirm': 'Вы уверены?',
    'dashboard.group.delete.success': 'Группа удалена',
    'dashboard.group.delete.error': 'Не удалось удалить группу',
    'dashboard.group.edit': 'Редактировать',
    'dashboard.group.delete': 'Удалить группу',
    'dashboard.group.add.values': 'Добавить значения для отображения',
    'dashboard.group.create.select.device': 'Выберите устройство',
    'dashboard.group.create.error.exists': 'Группа для этого устройства уже существует',
    'dashboard.group.create.success': 'Группа для {name} успешно создна',
    'dashboard.group.create.error': 'Не удалось создать группу',
    'dashboard.group.edit.success': 'Группа обновлена',
    'dashboard.group.edit.error': 'Не удалось обновить группу',
    'dashboard.group.edit.columns': `{
      column, select,
      type {тип}
      name {имя}
      units {единицы}
      other {{column}}
    }`,
    'dashboard.group.edit.types': `{
      value, select,
      sensor {сенсор}
      state {состояние}
      other {{value}}
    }`,
    'dashboard.group.edit.update.delay': 'Задержка обновлений (мс)',
    'dashboard.group.edit.save': 'Сохранить',
    'dashboard.group.edit.close.confirm':
      'Все несохраненные изменения будут потеряны, закрыть окно?',
    'dashboard.group.edit.observables': 'Сенсоры и состояния',
    'dashboard.group.edit.actions': 'Действия',
    'dashboard.group.edit.config': 'Настройки',
    'dashboard.group.edit.add.action': 'Добавить действие',
    'dashboard.group.edit.add.observables': 'Добавить сенсоры или состояния',
    'dashboard.group.edit.validation.error': 'Пожалуйста заполните требуемые поля',
    'dashboard.value.last.update.data': 'Последнее обновление: {date}',
    'dashboard.value.last.update.error': 'Значение не было найдено в ответе устройства',
    'danger.title': 'Пожалуйста, будьте аккуратны с данными действиями!',
    'danger.restart.confirm': 'Данное действие перезапустит устройство, вы уверены?',
    'danger.restart.success': 'Устройство перезапускается',
    'danger.restart.success.timeout': 'Устройство должно перезапуститься',
    'danger.restart.success.timeout.desc':
      'Возникла ошибка, которая означает перезапуск устройства.',
    'danger.restart.error': 'Не удалось перезапустить устройство',
    'danger.wipe.confirm': `{
      step, select,
      1 {ЭТО ДЕЙСТВИЕ УДАЛИТ ВСЕ НАСТРОЙКИ ИЗ ПАМЯТИ УСТРОЙСТВА!}
      2 {ЭТО ДЕЙСТВИЕ НЕВОЗМОЖНО БУДЕТ ОТМЕНИТЬ!}
      3 {ЭТО ПОСЛЕДНЕЕ ПРЕДУПРЕЖДЕНИЕ}
      other {}
    }`,
    'danger.wipe.success': 'Настройки удалены',
    'danger.wipe.success.desc': 'Устройство сейчас презагрузится',
    'danger.wipe.success.timeout': 'Устройство должно перезапуститься',
    'danger.wipe.success.timeout.desc': 'Возникла ошибка, которая означает перезапуск устройства.',
    'danger.wipe.error': 'Неудалось удалить настройки',
    'danger.button.restart': 'Перезапустить',
    'danger.button.wipe': 'Удалить все настройки с устройства',
    'ota.load.saved.error': 'Не удалось загрузить сохраненные прошивки',
    'ota.load.running.error': 'Не удалось загрузить активные обновления',
    'ota.saved.header': 'Доступные прошивки',
    'ota.running.header': 'Активные обновления прошивок',
    'ota.add.header': 'Добавить прошивку',
    'ota.add.button': 'Добавить',
    'ota.add.supported.error': 'Не удалось загрузить список доступных платформ',
    'ota.add.success': 'Прошивка добавлена',
    'ota.add.error': 'Ошибка при добавлении прошивки',
    'ota.firmware.info.board': 'Платформа',
    'ota.firmware.info.type': 'Тип',
    'ota.firmware.info.version': 'Версия',
    'ota.firmware.info.file': 'Файл прошивки',
    'ota.edit.header': 'Редактировать описание прошивки',
    'ota.edit.button': 'Сохранить',
    'ota.edit.succes': 'Данные обновлены',
    'ota.edit.error': 'Не удалось обновить данные',
    'ota.upload.confirm':
      'Вы уверены, что хотите загрузить прошивку {firmwareType} [{firmwareVersion}] ' +
      'на устройства: {deviceName}?',
    'ota.upload.success': 'Загрузка прошивки на {deviceName} начата',
    'ota.upload.error': 'Ошибка при запуске загрузки прошивки на {deviceName}',
    'ota.delete.confirm':
      'Вы уверены, что хотите удалить данную прошивку? Это действие нельзя отменить!',
    'ota.delete.success': 'Прошивка удалена',
    'ota.delete.error': 'Ошибка при удалении прошивки',
    'ota.firmware.menu.edit': 'Редактировать',
    'ota.firmware.menu.delete': 'Удалить',
    'ota.firmware.menu.upload': 'Загрузить',
    'ota.firmware.menu.download': 'Скачать',
    'ota.upload.to': 'Загрузить на',
    'ota.upload.block.firmware': 'Прошивка',
    'ota.upload.block.device': 'Устройство',
    'ota.upload.abort': 'Отменить загрузку',
    'ota.upload.abort.confirm': 'Загрузка прошивки на {device} будет отменена, вы уверены?',
    'ota.upload.abort.success': 'Загрузка прошивки отменена',
    'ota.upload.abort.error': 'Не удалось отменить загрузку прошивки',
    'ota.upload.status': `Статус: {
      status, select,
      STARTED {загрузка начинается}
      INVITATION {приглашение отправлено}
      INVITATION_FAILED {приглашение отклонено}
      INVITATION_ACCEPTED {приглашение принято}
      FIRMWARE_TRANSFER {передача прошивки}
      FIRMWARE_TRANSFER_FAILED {ошибка передачи}
      FIRMWARE_TRANSFER_CONFIRMATION {заврешение передачи}
      FIRMWARE_TRANSFER_FINISHED {передача завершена}
      FINISHED {загрузка завершена}
      ABORTED {загрузка отменена}
      other {{status}}
    }`,
    login: 'Логин',
    password: 'Пароль',
    'log.in': 'Войти',
    'log.out': 'Выйти из аккаунта',
    error: `{ type, select,
      access_denied {Доступ запрещен}
      other { чет как то мда... }
    }`
  }
}

export { messages }
