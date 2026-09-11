const express = require('express');
const router = express.Router();

const { listLanguages, getSite, getPage } = require('../controllers/siteController');
const { addLanguage, updateLanguage, upsertTranslation } = require('../controllers/adminController');
const { createInquiry, createSubscriber, listInquiries, listSubscribers } = require('../controllers/formController');
const { getMenu, listMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { getEvents, listEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const adminAuth = require('../middleware/adminAuth');

// ── Public ────────────────────────────────────────────────
router.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
router.get('/languages', listLanguages);
router.get('/site', getSite);
router.get('/page/:slug', getPage);
router.get('/menu/:page', getMenu);
router.get('/events', getEvents);
router.post('/inquiries', createInquiry);
router.post('/subscribers', createSubscriber);

// ── Admin (require x-admin-token header) ──────────────────
router.post('/admin/languages', adminAuth, addLanguage);
router.patch('/admin/languages/:code', adminAuth, updateLanguage);
router.put('/admin/translations/:model/:key', adminAuth, upsertTranslation);
router.get('/admin/inquiries', adminAuth, listInquiries);
router.get('/admin/subscribers', adminAuth, listSubscribers);
router.get('/admin/menu-items', adminAuth, listMenuItems);
router.post('/admin/menu-items', adminAuth, createMenuItem);
router.put('/admin/menu-items/:id', adminAuth, updateMenuItem);
router.delete('/admin/menu-items/:id', adminAuth, deleteMenuItem);
router.get('/admin/events', adminAuth, listEvents);
router.post('/admin/events', adminAuth, createEvent);
router.put('/admin/events/:id', adminAuth, updateEvent);
router.delete('/admin/events/:id', adminAuth, deleteEvent);

module.exports = router;
