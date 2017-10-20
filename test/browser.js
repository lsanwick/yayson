// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
mocha.setup('bdd')

import './yayson/store'
import './yayson/presenter'
import './yayson/utils'
import './yayson/adapter'
import './yayson/adapters/sequelize'

mocha.checkLeaks()
mocha.run()
