const ERRORS = {
    MISSING_PARAMS: {
        status: false,
        message: 'Missing Params',
    },

    RECORD_EXISTS: {
        status: false,
        message: 'Note Already Exist',
    },

    INVALID_PARAMS: {
        status: false,
        message: 'Invalid Params Value',
    },

    UNAUTHORIZE: {
        status: false,
        message: 'Unauthorize',
        code: 1001
    },

    SOMETHING_WRONG: {
        status: false,
        message: 'Something Went Wrong Please Try Again Later !',
    },

    INVALID_EMAIL_PASSWORD: {
        status: false,
        message: 'Invalid Email Or Password',
    },

    DUPLICATE_EMAIL: {
        status: false,
        message: 'Email address already exists',
    },

    DUPLICATE_USER: {
        status: false,
        message: 'User account already exists',
    },

    DB_ERROR: {
        status: false,
        message: 'DATABASE ERROR',
    },

    NO_RECORD: {
        status: false,
        message: "No Record Found"
    },
    INVALID_PERM: {
        status: false,
        message: "Invalid Permission, Please Try Again !"
    },
    NO_PERM: {
        status: false,
        message: "You Do Not Have Permission, Please Re-Login To Continue with correct access"
    }
}
const DAYS = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7
}
module.exports = {
    ERRORS,
    DAYS
}