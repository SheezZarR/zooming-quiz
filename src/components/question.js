function QuestContainer({children}) {
    return (
        <div style={styles.container}>
            <div style={styles.centeredContent}>
            {children}
            </div>
        </div>
    );
}

const styles = {
    container: {
        borderRadius: '10px',
        margin: '40px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        alignContent: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        flexDirection: 'column',
        backgroundColor: 'rgba(13,231,206,0.87)'
    },
    centeredContent: {
        textAlign: 'center',
        padding: '30px',
        textAlignLast: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%'
    }
}

export default QuestContainer