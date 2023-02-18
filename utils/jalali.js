const moment = require('jalali-moment');


// transform date to shamsi date
exports.formatDate = date => {
    return moment(date).locale("fa").format("D MMM YYYY");
}