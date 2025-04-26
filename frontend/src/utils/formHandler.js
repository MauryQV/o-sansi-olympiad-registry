export const createChangeHandler = (setState) => (e) => {
    const { id, value } = e.target;
    setState(prev => ({
        ...prev,
        [id]: value
    }));
};

export const createNameChangeHandler = (setState) => (e) => {
    const { id } = e.target;
    const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 25);
    setState(prev => ({
        ...prev,
        [id]: filtered
    }));
};

export const createIdChangeHandler = (setState) => (e) => {
    const filtered = e.target.value.replace(/\D/g, '').slice(0, 8);
    setState(prev => ({
        ...prev,
        idNumber: filtered
    }));
};

export const createEmailChangeHandler = (setState) => (e) => {
    const value = e.target.value.slice(0, 50);
    setState(prev => ({
        ...prev,
        email: value
    }));
};
