const { Sale, User } = require("../models"); 

async function createSale(userId, productName, saleAmount, costPrice, saleCategory = null) {
    
    const profit = saleAmount - costPrice;

    const saleData = {
        userId,
        productName,
        saleAmount: parseFloat(saleAmount), 
        costPrice: parseFloat(costPrice),  
        profit,
        saleCategory,
        saleDate: new Date(),
        status: 'active', 
    };

    console.log("Sale Data: ", saleData);

    try {
        const sale = await Sale.create(saleData);
        return sale;
    } catch (error) {
        console.error("Error creating sale:", error);
        throw error; 
    }
}
async function getUserSalesData(user, page, limit, startDate, endDate, sort) {
   
    const offset = (page - 1) * limit;
    const salesQuery = {
        where: { userId: user },
        limit: parseInt(limit),
        offset: offset,
        order: [[sort, 'DESC']], 
    };

    // Apply date filtering if provided
    if (startDate || endDate) {
        salesQuery.where.saleDate = {};
        if (startDate) {
            salesQuery.where.saleDate[Op.gte] = new Date(startDate); // Greater than or equal
        }
        if (endDate) {
            salesQuery.where.saleDate[Op.lte] = new Date(endDate); // Less than or equal
        }
    }

    
    const sales = await Sale.findAll(salesQuery);

    const salesData = sales.map(sale => {
        const commissionEarned = (parseFloat(sale.saleAmount) - parseFloat(sale.costPrice)) * 0.20; 
        return {
            saleId: sale.id, 
            productName: sale.productName,
            saleAmount: parseFloat(sale.saleAmount),
            commissionEarned: commissionEarned,
            saleCategory: sale.saleCategory,
            saleDate: sale.saleDate.toISOString().split('T')[0], 
        };
    });

  
    const totalCommission = salesData.reduce((total, sale) => total + sale.commissionEarned, 0);


    const totalSalesCount = await Sale.count({ where: { userId: user } });

    
    return {
        userId: user,
        userName: user.name, 
        totalSales: totalSalesCount,
        currentPage: page,
        totalPages: Math.ceil(totalSalesCount / limit),
        sales: salesData,
        totalCommission: totalCommission, 
    };
}


async function getAllSales({ page = 1, limit = 10, sortBy = 'saleAmount', order = 'DESC', filters = {} }) {
    try {
        const offset = (page - 1) * limit;
        const where = {};

        if (filters.saleCategory) {
            where.saleCategory = filters.saleCategory;
        }

        if (filters.saleDate) {
            where.saleDate = filters.saleDate;
        }

        const salesData = await Sale.findAll({
            where,
            limit,
            offset,
            order: [[sortBy, order]]
        });

        return salesData;
    } catch (error) {
        console.error('Error fetching sales data:', error);
        throw new Error('Error fetching sales data: ' + error.message);
    }
}



module.exports = {
    createSale,
    getUserSalesData,
    getAllSales
};
