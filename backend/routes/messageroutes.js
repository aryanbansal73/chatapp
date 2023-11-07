const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage  , allmessages} = require('../controllers/messageController');

const router = express.Router() ;

router.route('/').post(protect, sendMessage) ;
router.route('/:chatId').get(protect , allmessages) ;

module.exports = router ;