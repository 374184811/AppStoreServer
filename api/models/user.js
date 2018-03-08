module.exports = {
  attributes: {
    username: {
      type: 'string',
      unique: true,
      required: true
    },
    email: {
      type: 'string',
      unique: true,
      required: true
    },
  },

  validationMessages:function() {
    console.log('hehe....')
  }
};

//define your model in api/model/Authentication.js
// module.exports = {
//     attributes: {
//         username: {
//             type: 'string',
//             required: true,
//             columnType:'username'
//         },
//         email: {
//             type: 'email',
//             required: true,
//             unique: true,
//             columnType:'email'
//         },
//         birthday: {
//             type: 'date',
//             required: true,
//             columnType:'birthday'
//         }
//     }
//};