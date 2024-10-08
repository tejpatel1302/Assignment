const { StatusCodes } = require('http-status-codes');

const { UserService, SaleService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');




async function createSale(req, res, next) {
    console.log(req.user,'reqqqq')
    try {
        const { productName, saleAmount, costPrice, saleCategory } = req.body;
        const userId = req.user; 
        console.log("User ID: ", userId); 
        const sale = await SaleService.createSale(userId, productName, saleAmount, costPrice, saleCategory);
        res.json(sale);
    } catch (error) {
        next(error);
    }
}
async function getUserSales(req, res) {
    try {
        const user = req.user; 
        const { page = 1, limit = 10, startDate, endDate, sort = 'saleAmount' } = req.query;

        const salesData = await SaleService.getUserSalesData(user, page, limit, startDate, endDate, sort);

        res.status(200).json(salesData); // Send formatted response
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({ error: error.message });
    }
}

async function getAdminSalesData(req, res) {
    try {
        const { page, limit, sortBy, order, saleCategory, saleDate } = req.query;

        const filters = {};
        if (saleCategory) filters.saleCategory = saleCategory;
        if (saleDate) filters.saleDate = saleDate;

        const salesData = await SaleService.getAllSales({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sortBy: sortBy || 'saleAmount',
            order: order || 'DESC',
            filters
        });

        res.status(200).json(salesData);
    } catch (error) {
        next(error);
    }
}





module.exports = {
    createSale,
    getUserSales,
    getAdminSalesData
}