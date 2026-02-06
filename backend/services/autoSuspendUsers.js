const User = require('../models/user');

const INACTIVITY_DAYS = 60;

const autoSuspendInactiveUsers = async () => {
    try {
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - INACTIVITY_DAYS);

        const result = await User.updateMany(
            {
                role: { $ne: 'ADMIN' },        // ⛔ no admins
                status: 'ACTIVE',              // solo activos
                lastLoginAt: { $lt: limitDate } // inactivos
            },
            {
                $set: {
                    status: 'SUSPENDED',
                    suspensionReason: 'INACTIVITY'
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`🛑 ${result.modifiedCount} usuarios suspendidos por inactividad`);
        }

    } catch (error) {
        console.error('🔥 Error en auto suspensión:', error);
    }
};

module.exports = autoSuspendInactiveUsers;
