const defaultLocale = 'en'
const currentLocale = navigator.language.slice(0, 2)

const messages = {
  en: {
    'doc.title': 'SmartThing',
    'doc.panel': 'Control panel',
    'doc.dashboard': 'Dashboard',
    'doc.device.settings': 'Device settings',
    'doc.device.logs': 'Device logs',
    gateway: 'Gateway: {gateway}',
    'gateway.panel': 'Control panel for {device}',
    'gateway.cloud.auth.title': 'Add cloud token',
    'gateway.cloud.auth.conn.token': 'Connection token',
    'gateway.cloud.auth.ip': 'Cloud ip',
    'gateway.cloud.auth.port': 'Cloud port',
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
    'gateway.cloud.info.identity': 'Identity',
    'gateway.cloud.info.user': 'User',
    'gateway.cloud.info.gateway': 'Gateway',
    'gateway.cloud.config': 'Cloud connection config',
    'gateway.cloud.config.ip': 'Ip',
    'gateway.cloud.config.port': 'port',
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
    'gateway.item.token.validation.ip.blank': "Cloud ip can't be blank",
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
    'gateway.item.cloud.ip': 'Cloud ip',
    'gateway.item.cloud.port': 'Cloud port',
    'gateway.item.auth.token': 'Auth token',
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
    'device.tabs': `{
      tab, select,
      info {Information}
      actions {Actions}
      sensors {Sensors}
      states {States}
      config {Configuration}
      metrics {Metrics}
      other {{tab}}
    }`,
    'device.settings.editor.name.empty': "Name can't be empty!",
    'device.settings.editor.name.empty.desc': 'Insert settings name',
    'device.settings.editor.setting.empty': "Settings can't be empty!",
    'device.settings.editor.setting.empty.desc': 'Insert settings json',
    'device.settings.editor.updated': 'Settings updated!',
    'device.settings.editor.created': 'Settings created!',
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
    'device.settings.manager.add': 'Add new',
    'device.settings.manager.menu.header': 'Saved devices settings',
    'device.actions.title': 'Device actions',
    'device.actions.empty': 'No actions configured',
    'device.config.title': 'Configuration',
    'device.config.button.delete.all': 'Delete all values',
    'device.config.button.save': 'Save',
    'device.config.delete.confirm': 'Are you sure you want to delete all configuration values?',
    'device.config.empty.entries': 'No config entries configured',
    'device.info.title': 'Device information',
    'device.info.name': 'Device name',
    'device.info.name.error.empty': "Name can't be empty!",
    'device.info.name.save': 'save',
    'device.info.type': 'Device type',
    'device.info.version': 'Firmware version',
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
    'device.sensors.title': 'Sensors values',
    'device.sensors.empty': 'No sensors configured',
    'device.states.title': 'Device states',
    'device.states.empty': 'No states configured',
    'devices.search': 'Found devices',
    'devices.search.empty': 'No devices found',
    'devices.search.in.progress': 'Searching...',
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
    'dashboard.group.edit.title': 'Edit group {name}',
    'dashboard.groups.empty': 'No groups added yet',
    'dashboard.group.add.new': 'Add new group',
    'dashboard.group.update.title': 'Click to force update\nAuto update every {updateDelay}s\nLast update {count}s ago',
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
    'dashboard.group.edit.update.delay': 'Update delay (sec)',
    'dashboard.group.edit.save': 'Save',
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
    'doc.dashboard': 'Dashboard',
    'doc.device.settings': 'Настройки устройств',
    'doc.device.logs': 'Логи устройств',
    gateway: 'Маршрутизатор: {gateway}',
    'gateway.panel': 'Панель управления {device}',
    'gateway.cloud.auth.title': 'Добавить токен облака',
    'gateway.cloud.auth.conn.token': 'Токен подключения',
    'gateway.cloud.auth.ip': 'Ip облакак',
    'gateway.cloud.auth.port': 'Порт облака',
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
    'gateway.cloud.info.identity': 'Аккаунт',
    'gateway.cloud.info.user': 'Пользователь',
    'gateway.cloud.info.gateway': 'Маршрутизатор',
    'gateway.cloud.config': 'Адрес облака',
    'gateway.cloud.config.ip': 'Ip',
    'gateway.cloud.config.port': 'Порт',
    'gateway.cloud.reconnect': 'Переподключиться',
    'gateway.cloud.disconnect': 'Отключиться',
    'gateway.cloud.add.token': 'Добавить токен облака',
    'gateway.edit.button': `{
      action, select,
      update {Обновить}
      create {Создать}
      other {{ action }}
    }`,
    'gateway.edit.validation.name.blank': "Имя маршрутизатора не может быть пустым!",
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
    'gateway.item.token.validation.ip.blank': "Ip облака не может быть пустым",
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
    'gateway.item.cloud.ip': 'Ip облака',
    'gateway.item.cloud.port': 'Порт облака',
    'gateway.item.auth.token': 'Токен авторизации',
    'gateway.select.offline': 'Маршрутизатор не в сети!',
    'gateway.select.offline.desc': "Нельзя открыть панель управления маршрутизатора, если он не в сети.",
    'gateway.create.success': 'Маршрутизатор создан',
    'gateway.create.error': 'Не удалось создать маршрутизатор',
    'gateway.create.button': 'Создать маршрутизатор',
    'gateway.selector.title': 'ВЫберите аршрутизатор',
    'device.logs.columns': `{
      column, select,
      device {Устройство}
      date {Дата}
      level {Уровень}
      msg {Сообщение}
      tag {Тег}
      other {{ column }}
    }`,
    'device.tabs': `{
      tab, select,
      info {Информация}
      actions {Действия}
      sensors {Сенсоры}
      states {Состояния}
      config {Конфигурация}
      metrics {Метрики}
      other {{tab}}
    }`,
    'device.settings.editor.name.empty': "Название не может быть пустым",
    'device.settings.editor.name.empty.desc': 'Введите название настроек',
    'device.settings.editor.setting.empty': "Настройки не могут быть пустыми",
    'device.settings.editor.setting.empty.desc': 'Вставьте JSON настроек',
    'device.settings.editor.updated': 'Настройки обновлены!',
    'device.settings.editor.created': 'Настройки сохранены!',
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
    'device.actions.title': 'Действия',
    'device.actions.empty': 'Нет настроенных действий',
    'device.config.title': 'Конфигурация',
    'device.config.button.delete.all': 'Удалить все значения',
    'device.config.button.save': 'Сохранить',
    'device.config.delete.confirm': 'Вы уверены, что хотите удалить все значения?',
    'device.config.empty.entries': 'Нет настроенных полей в конфигурации',
    'device.info.title': 'Системная информация',
    'device.info.name': 'Имя устройства',
    'device.info.name.error.empty': "Имя не может быть пустым!",
    'device.info.name.save': 'сохранить',
    'device.info.type': 'Тип устройства',
    'device.info.version': 'Версия прошивки',
    'device.info.chip.model': 'Модель чипа',
    'device.info.chip.revision': 'Ревизия чипа',
    'device.hooks.menu.item.title': 'Нажмите для открытия хуков',
    'device.hooks.select.to.manage': `Select {
      type, select,
      sensor {сенсор}
      state {состояние}
      other {{type}}
    } to manage hooks`,
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
    'device.sensors.title': 'Значения сенсоров',
    'device.sensors.empty': 'Нет настроенных сенсоров',
    'device.states.title': 'Состояния устройства',
    'device.states.empty': 'Нет настроенных состояний',
    'devices.search': 'Устройства',
    'devices.search.empty': 'Устройства не найдены!',
    'devices.search.in.progress': 'Поиск...',
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
    'dashboard.group.edit.title': 'Редактировать группу {name}',
    'dashboard.groups.empty': 'Пока еще не было добавлено групп',
    'dashboard.group.add.new': 'Добавить новую группу',
    'dashboard.group.update.title': 'Нажмите для принудительного обновления\nАвтоматическое обновление каждые {updateDelay}сек\nПоследнее обновление {count}сек назад',
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
    'dashboard.group.edit.update.delay': 'Задержка обновлений (сек)',
    'dashboard.group.edit.save': 'Сохранить',
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

export { defaultLocale, currentLocale, messages }
