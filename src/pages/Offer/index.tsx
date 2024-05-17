import { useNavigate, useParams } from 'react-router-dom';
import CommentForm from './components/CommentForm.tsx';
import ReviewsList from './components/Reviews/ReviewsList.tsx';
import NearOffers from './components/NearOffers.tsx';
import { useAppSelector } from '../../hooks/useAppSelector.tsx';
import Loader from '../../components/Loader.tsx';
import Page404 from '../404';
import { useAppDispatch } from '../../hooks/useAppDispatch.ts';
import { changeIsFavorite, fetchOfferInfoAction, fetchOffersNearby, fetchReviews } from '../../store/apiActions.ts';
import { useEffect, useState } from 'react';
import { City } from '../../types/City.ts';
import Map from '../../components/Map.tsx';
import { AuthorizationStatus } from '../../const.ts';


function Offer() {
  const params = useParams();

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchOfferInfoAction(params.id ?? 'none'));
    dispatch(fetchOffersNearby(params.id ?? 'none'));
    dispatch(fetchReviews(params.id ?? 'none'));
  }, [dispatch, params.id]);


  const isLoadingInfo = useAppSelector((state) => state.isLoadingOfferInfo);

  const isLoading = useAppSelector((state) => state.isOffersDataLoading || state.isLoadingOffersNearby || state.reviewsLoading);

  const offer = useAppSelector((state) => state.selectedOffer);
  const nearOffers = useAppSelector((state) => state.offersNearby);

  const reviews = useAppSelector((state) => state.reviews);
  const hasAccess = useAppSelector((state) => state.authorizationStatus);

  const city: City = {
    title: offer?.city.name ?? '',
    lat: offer?.city.location.latitude ?? 0,
    lng: offer?.city.location.longitude ?? 0,
    zoom: offer?.city.location.zoom ?? 0
  };

  if (!offer && !isLoading) {
    return <Page404/>;
  }

  const points = nearOffers.map((offerItem) => ({
    id: offerItem.id,
    title: offerItem.title,
    lat: offerItem.location.latitude,
    lng: offerItem.location.longitude
  }));

  const navigate = useNavigate();

  const [favorite, setFavorite] = useState(offer?.isFavorite)

  const onClickFavorite = () => {
    if (hasAccess !== AuthorizationStatus.Auth) {
      navigate('/login');
    }
    dispatch(changeIsFavorite({ id: offer?.id ?? '', status: !favorite ? 1 : 0 }));
    setFavorite(!favorite);
  }

  return (
    <main className="page__main page__main--offer">
      {isLoadingInfo || !offer ?
        <Loader/> :
        <>
          <section className="offer">
            <div className="offer__gallery-container container">
              <div className="offer__gallery">
                {offer.images.map((img) =>
                  (
                    <div key={img} className="offer__image-wrapper">
                      <img className="offer__image" src={img} alt="Photo studio"/>
                    </div>
                  ))}
              </div>
            </div>
            <div className="offer__container container">
              <div className="offer__wrapper">
                {offer.isPremium &&
                  <div className="offer__mark">
                    <span>Premium</span>
                  </div>}
                <div className="offer__name-wrapper">
                  <h1 className="offer__name">
                    {offer.title}
                  </h1>
                  <button
                    className={`offer__bookmark-button offer__bookmark-button${favorite ? '--active' : ''} button`}
                    type="button"
                    onClick={onClickFavorite}
                  >
                    <svg className="offer__bookmark-icon" width="31" height="33">
                      <use xlinkHref="#icon-bookmark"></use>
                    </svg>
                    <span className="visually-hidden">To bookmarks</span>
                  </button>
                </div>
                <div className="offer__rating rating">
                  <div className="offer__stars rating__stars">
                    <span style={{ width: `${offer.rating * 2 * 10}%` }}></span>
                    <span className="visually-hidden">Rating</span>
                  </div>
                  <span className="offer__rating-value rating__value">{offer.rating}</span>
                </div>
                <ul className="offer__features">
                  <li className="offer__feature offer__feature--entire">
                    {offer.type}
                  </li>
                  <li className="offer__feature offer__feature--bedrooms">
                    {offer.bedrooms} Bedrooms
                  </li>
                  <li className="offer__feature offer__feature--adults">
                    Max {offer.maxAdults} adults
                  </li>
                </ul>
                <div className="offer__price">
                  <b className="offer__price-value">&euro;{offer.price}</b>
                  <span className="offer__price-text">&nbsp;night</span>
                </div>
                <div className="offer__inside">
                  <h2 className="offer__inside-title">What&apos;s inside</h2>
                  <ul className="offer__inside-list">
                    {offer.goods.map((good) => (
                      <li key={good} className="offer__inside-item">
                        {good}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="offer__host">
                  <h2 className="offer__host-title">Meet the host</h2>
                  <div className="offer__host-user user">
                    <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                      <img className="offer__avatar user__avatar" src={offer.host.avatarUrl} width="74" height="74"
                        alt="Host avatar"
                      />
                    </div>
                    <span className="offer__user-name">{offer.host.name}</span>
                    {offer.host.isPro &&
                      <span className="offer__user-status">Pro</span>}
                  </div>
                  <div className="offer__description">
                    <p className="offer__text">
                      {offer.description}
                    </p>
                  </div>
                </div>
                <section className="offer__reviews reviews">
                  <ReviewsList reviews={reviews}/>
                  {hasAccess === AuthorizationStatus.Auth &&
                    <CommentForm id={offer.id}/>}
                </section>
              </div>
            </div>
            <section style={{ maxWidth: '1144px', margin: 'auto', marginBottom: '50px' }}>
              <Map city={city} points={points} selectedPoint={undefined}/>
            </section>

          </section>
          {!!nearOffers.length &&
            <div className="container">
              <NearOffers offers={nearOffers.slice(0, 3)}/>
            </div>}
        </>}
    </main>
  );
}

export default Offer;
