const Button = ({ children }) => {
    return (
        <button style={styles.button}>
      <span style={styles.centeredText}>
        {children}
      </span>
        </button>
    );
};

const styles = {
    button: {
        padding: '10px 20px',
        borderRadius: '5px',
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
    },
    centeredText: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
};

export default Button;
