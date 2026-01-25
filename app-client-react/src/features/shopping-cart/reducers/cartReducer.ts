export const initialState = { items: [], totalAmount: 0 };

export const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return {
                items: action.payload.items,
                totalAmount: action.payload.totalAmount,
            };
        default:
            return state;
    }
};
