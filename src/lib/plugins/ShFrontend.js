import { ShCore, shStorage } from '@iankibetsh/sh-core'
import ShUserProfile from '../components/core/auth/ShUserProfile.vue'
import Departments from '../components/core/Departments/Departments.vue'
import Department from '../components/core/Departments/department/Department.vue'
import ManagePermissions from '../components/core/Departments/department/ManagePermissions.vue'
import ShAuth from '../components/core/auth/ShAuth.vue'
import NoRecords from '../components/others/NoRecords.vue'

const ShFrontend = {
  install: (app, options = {}) => {
    // Core concerns (API client, auth strategy, config, session,
    // v-if-user-can directive, auth endpoint provides) live in sh-core
    ShCore.install(app, options)

    const shFormElements = options.shFormElementClasses ?? {}
    const defaultFormElementClasses = {
      formGroup: shFormElements.formGroup ?? 'mb-2',
      formLabel: shFormElements.formLabel ?? 'form-label',
      helperText: shFormElements.helperText ?? 'form-text',
      actionBtn: shFormElements.actionBtn ?? 'btn btn-primary',
      formErrorTitle: shFormElements.formErrorTitle ?? 'alert alert-danger',
      invalidFeedback: shFormElements.invalidFeedback ?? 'invalid-feedback',
      formControl: shFormElements.formControl ?? 'form-control',
    }
    const registerTitle = options.registerTitle ?? 'Create a new account'
    const registerSubTitle = options.registerSubTitle ?? `It's quick and easy`
    const loginTitle = options.loginTitle ?? `Login to your account`
    const redirectLogin = options.redirectLogin ?? `/`
    const redirectRegister = options.redirectRegister ?? `/`
    const noRecordsComponent = options.noRecordsComponent ?? NoRecords
    const registrationFields = options.registrationFields ?? ['name','email','phone','password','password_confirmation']
    const AuthComponent = options.authComponent ?? ShAuth
    const cacheUserFields = options.cacheUserFields ?? ['id']

    app.provide('registrationFields', registrationFields)
    app.provide('registerTitle', registerTitle)
    app.provide('registerSubTitle', registerSubTitle)
    app.provide('redirectLogin', redirectLogin)
    app.provide('loginTitle', loginTitle)
    app.provide('redirectRegister', redirectRegister)
    app.provide('formComponents', options.shFormComponents ?? {})
    app.provide('shFormElementClasses', defaultFormElementClasses)
    app.provide('noRecordsComponent', noRecordsComponent)
    app.provide('cacheUserFields', cacheUserFields)

    // sh-core's setShConfig only persists scalars, but ShIndexedDB reads
    // cacheUserFields (an array) from the stored ShConfig for cache prefixing
    shStorage.setItem('ShConfig', { ...(shStorage.getItem('ShConfig') ?? {}), cacheUserFields })

    if (options.router) {
      options.router.addRoute({
        path: '/sh-auth',
        component: AuthComponent
      })
      options.router.addRoute({
        path: '/sh-departments',
        component: Departments
      })
      options.router.addRoute({
        path: '/sh-departments/permissions/:id',
        component: Department
      })
      options.router.addRoute({
        path: '/sh-departments/manage-permissions/:id',
        component: ManagePermissions
      })
      options.router.addRoute({
        path: '/sh-user-profile',
        component: ShUserProfile
      })
    }
  }
}
export default ShFrontend
