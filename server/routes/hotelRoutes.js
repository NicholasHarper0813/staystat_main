const router = require('express').Router();
const hotelController = require('../controllers/hotelController');

router.post('/hotel/get-one-hotels' ,hotelController.getHotel);
router.post('/hotel/get-all-hotels' ,hotelController.getAllHotels);
router.get('/hotel/get-all-hotels/search' ,hotelController.getAllHotelsBySearch);
router.post('/hotel/create-hotel',hotelController.createHotel);
router.post('/hotel/update-hotel', hotelController.updateHotel);
router.post('/hotel/delete-hotel', hotelController.deleteHotel);
router.post('/hotel/update-hotel-status', hotelController.updateHotelStatus);

module.exports = router;