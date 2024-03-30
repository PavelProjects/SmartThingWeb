const defaultLocale = 'en'
const currentLocale = navigator.language.slice(0, 2)

const messages = {
  en: {
    'doc.title': 'SmartThing',
    'doc.home': 'Home',
    'doc.device.settings': 'Device settings',
    'doc.device.logs': 'Device logs',
    gateway: 'Gateway: {gateway}',
    'gateway.panel': 'Control panel',
    'gateway.cloud.auth.title': 'Add cloud token',
    'gateway.cloud.auth.conn.token': 'Connection token',
    'gateway.cloud.auth.ip': 'Cloud ip',
    'gateway.cloud.auth.port': 'Cloud port',
    'gateway.cloud.auth.token': 'Auth token',
    'gateway.cloud.auth.connect': 'Connect',
    'gateway.cloud.conn.status': 'Cloud: {status}',
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
    'gateway.cloud.config': 'Cloud config',
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
    'gateway.item.delete.confirm': 'Are you sure ypu want to delete gateway {name}?',
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
    'gateway.selector.title': 'Gateways',
    'device.logs.columns': `{
      column, select,
      device {Device}
      date {Date}
      level {Level}
      msg {Message}
      other {{ column }}
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
    'device.hooks.title': 'Hooks',
    'device.hooks.button.add': 'Add hook of type ',
    'device.hooks.empty': 'No hooks added yet',
    'device.hook.validation.error': 'Validation failed',
    'device.hook.validation.error.desc': 'This fields cannot be empty: {fields}',
    'device.hook.delete.confirm': 'Are you sure you wan to delete hook {id}?',
    'device.hook.readonly': 'Readonly',
    'device.sensors.title': 'Sensors values',
    'device.sensors.empty': 'No sensors configured',
    'device.states.title': 'Device states',
    'device.states.empty': 'No states configured',
    'cloud.auth.lprequired': 'Login and password are required!',
    'cloud.auth.logout.confirm': 'Are you sure?',
    'cloud.auth.info.user.id': 'id: {id}',
    'cloud.auth.info.user.login': 'login: {login}',
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
    'doc.home': 'Домашняя страница',
    'doc.device.settings': 'Настройки устройств',
    'doc.device.logs': 'Device logs',
    gateway: 'Gateway: {gateway}',
    'gateway.panel': 'Control panel',
    'gateway.cloud.auth.title': 'Add cloud token',
    'gateway.cloud.auth.conn.token': 'Connection token',
    'gateway.cloud.auth.ip': 'Cloud ip',
    'gateway.cloud.auth.port': 'Cloud port',
    'gateway.cloud.auth.token': 'Auth token',
    'gateway.cloud.auth.connect': 'Connect',
    'gateway.cloud.conn.status': 'Cloud: {status}',
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
    'gateway.cloud.config': 'Cloud config',
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
    'gateway.item.delete.confirm': 'Are you sure ypu want to delete gateway {name}?',
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
    'gateway.selector.title': 'Gateways',
    'device.logs.columns': `{
      column, select,
      device {Device}
      date {Date}
      level {Level}
      msg {Message}
      other {{ column }}
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
    'device.hooks.title': 'Hooks',
    'device.hooks.button.add': 'Add hook of type ',
    'device.hooks.empty': 'No hooks added yet',
    'device.hook.validation.error': 'Validation failed',
    'device.hook.validation.error.desc': 'This fields cannot be empty: {fields}',
    'device.hook.delete.confirm': 'Are you sure you wan to delete hook {id}?',
    'device.hook.readonly': 'Readonly',
    'device.sensors.title': 'Sensors values',
    'device.sensors.empty': 'No sensors configured',
    'device.states.title': 'Device states',
    'device.states.empty': 'No states configured',
    'cloud.auth.lprequired': 'Login and password are required!',
    'cloud.auth.logout.confirm': 'Are you sure?',
    'cloud.auth.info.user.id': 'id: {id}',
    'cloud.auth.info.user.login': 'login: {login}',
    login: 'Login',
    password: 'Password',
    'log.in': 'Log in',
    'log.out': 'Log out',
    error: `{ type, select,
      access_denied {Access denied}
      other { An error has occurred }
    }`
  }
}

export { defaultLocale, currentLocale, messages }
