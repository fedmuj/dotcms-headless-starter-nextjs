import Banner from "./Banner";
import BannerCarousel from "./BannerCarousel";
import CoverTier from "./CoverTier";
import FaqWidget from "./FaqWidget";
import FMCCard from "./FMCCard";
import WebPageContent from "./WebPageContent";

/*
 * Maps DotCMS content-types to React components.
 * DotCMSLayoutBody uses this map to decide which component to render for each
 * content block on the page. Add entries as you build out content types, e.g.:
 *   import HeroCard from "./HeroCard";
 *   export const pageComponents = { HeroCard: HeroCard};
 */
export const pageComponents = {
  Banner: Banner,
  BannerCarousel: BannerCarousel,
  CoverTier: CoverTier,
  FaqWidget: FaqWidget,
  FMCCard: FMCCard,
  webPageContent: WebPageContent,
};
