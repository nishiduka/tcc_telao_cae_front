const Modal = ({
  show,
  setShow,
  children,
  footer,
  titulo,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
  children?: React.ReactNode;
  footer?: () => React.ReactNode;
  titulo: string;
}) => {
  const handleClose = () => setShow(false);

  return (
    <div>
      {show && (
        <div
          className="modal show"
          style={{
            display: 'block',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{titulo}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">{children}</div>
              <div className="modal-footer">
                {footer ? (
                  footer()
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleClose}
                  >
                    Fechar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
