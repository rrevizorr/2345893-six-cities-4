import { ColorRing } from 'react-loader-spinner';

function Loader(): JSX.Element {
  return (
    <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
      <ColorRing
        visible
        height="80"
        width="80"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />
    </div>
  );
}

export default Loader;
