import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { ProductCard } from '../../components/ProductCard';
import { houseById, productsByHouse } from '../../data/catalogue';
import { useStore } from '../../store/useStore';
import './C08HouseProfile.css';

/**
 * C08 House Profile — port of rsn-one-html/C08-HouseProfile.html. Hero + cream panel
 * from the house record; below the mock's content, an "Objects from {house}" rail
 * (C03 product-rail pattern) lists the house's products.
 */
export default function C08HouseProfile() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const house = houseById(id);
  const showToast = useStore(s => s.showToast);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (!house) navigate('/shop', { replace: true }); }, [house, navigate]);
  useEffect(() => { setSaved(false); }, [id]);
  if (!house) return null;

  const objects = productsByHouse(house.id);
  const explore = `/search/results?house=${house.id}`;

  return (
    <div className="screen c08">
      {/* HERO — full-bleed house photograph; status bar, back arrow and heart overlaid.
          ASSUMPTION (handoff): both overlay icons sit on bare photography with no scrim. */}
      <section className="house-hero">
        <Img className="house-hero__media" slot={house.image} alt={house.name} width={853} height={862} />
        <StatusBar />
        <div className="house-hero__bar">
          <button aria-label="Back" onClick={() => navigate(-1)}>
            <svg width="42" height="38" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 11H1M9 3 1 11l8 8" /></svg>
          </button>
          {/* POC: houses are not wishlist items in the store — this heart is a local
              "follow" toggle with a toast so the control is not inert */}
          <button className={saved ? 'house-hero__save--on' : ''} aria-pressed={saved}
            aria-label={`${saved ? 'Unsave' : 'Save'} ${house.name}`}
            onClick={() => { setSaved(!saved); showToast(saved ? `Removed ${house.name}` : `Saved ${house.name}`); }}>
            <svg width="48" height="43" viewBox="0 0 18 16" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.2"><path d="M9 15S1 10.4 1 5.6A4.3 4.3 0 0 1 9 3.4 4.3 4.3 0 0 1 17 5.6C17 10.4 9 15 9 15Z" /></svg>
          </button>
        </div>
      </section>

      {/* HOUSE PANEL — cream sheet: name, location, lede, CTA, hairline, "The House" */}
      <section className="house-panel">
        <h1 className="house-panel__name">{house.name}</h1>
        <p className="house-panel__place">{house.city}, {house.country}</p>
        <p className="house-panel__lede">{house.tagline}</p>

        {/* DEVIATION-RISK (handoff): the CTA fill is 655px wide but its label is optically
            centred on the full 717px column — transcribed as drawn */}
        <Link className="house-panel__cta" to={explore}>Explore the house</Link>

        <hr className="house-panel__rule" />

        <div className="house-section">
          <div className="house-section__head">
            <h2 className="house-section__title">The House</h2>
            <Link className="house-section__go" to={explore} aria-label="Open The House">
              <svg width="42" height="38" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 11h22M15 3l8 8-8 8" /></svg>
            </Link>
          </div>
          <p className="house-section__body">{house.story}</p>
        </div>

        {/* POC ADDITION — the house's objects, C03 product-rail pattern on the panel */}
        <div className="house-section house-section--objects">
          <div className="house-section__head">
            <h2 className="house-section__title">Objects from {house.name}</h2>
            <Link className="house-section__go" to={explore} aria-label={`See all objects from ${house.name}`}>
              <svg width="42" height="38" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 11h22M15 3l8 8-8 8" /></svg>
            </Link>
          </div>
          {objects.length ? (
            <ul className="product-rail">
              {objects.map(p => <ProductCard key={p.id} product={p} />)}
            </ul>
          ) : (
            <p className="house-section__empty">New objects from this house are on their way.</p>
          )}
        </div>

        {/* HOME INDICATOR — dark on the cream panel */}
        <HomeIndicator className="home-indicator--light" />
      </section>
    </div>
  );
}
