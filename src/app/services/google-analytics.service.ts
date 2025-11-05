import { Injectable } from '@angular/core';
import { ANALYTICS_CONFIG } from '../config/analytics.config';

declare let gtag: Function;

@Injectable({
    providedIn: 'root'
})
export class GoogleAnalyticsService {

    private cookiebotLoaded = false;

    constructor() {
        // Attendre que Cookiebot soit chargé
        this.waitForCookiebot();
    }

    private waitForCookiebot(): void {
        if (typeof window !== 'undefined') {
            const checkCookiebot = () => {
                if ((window as any).Cookiebot && (window as any).Cookiebot.consent) {
                    this.cookiebotLoaded = true;
                    // Mettre à jour le consentement Google Analytics quand Cookiebot est prêt
                    this.updateGAConsent();
                } else {
                    setTimeout(checkCookiebot, 100);
                }
            };
            checkCookiebot();
        }
    }

    private updateGAConsent(): void {
        if (typeof gtag !== 'undefined') {
            const hasStatsConsent = (window as any).Cookiebot.consent.statistics;
            gtag('consent', 'update', {
                'analytics_storage': hasStatsConsent ? 'granted' : 'denied'
            });
        }
    }

    /**
     * Envoie un événement à Google Analytics
     * @param action L'action effectuée (ex: 'click', 'download', 'contact')
     * @param category La catégorie de l'événement (ex: 'engagement', 'navigation')
     * @param label Label optionnel pour plus de détails
     * @param value Valeur numérique optionnelle
     */
    trackEvent(action: string, category: string = 'general', label?: string, value?: number) {
        if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.ENABLED) {
            // Si Cookiebot n'est pas encore chargé, attendre
            if (!this.cookiebotLoaded) {
                setTimeout(() => this.trackEvent(action, category, label, value), 500);
                return;
            }

            if (this.hasConsent()) {
                gtag('event', action, {
                    event_category: category,
                    event_label: label,
                    value: value
                });

                if (ANALYTICS_CONFIG.DEBUG) {
                    console.log('GA Event:', { action, category, label, value });
                }
            }
        }
    }

    /**
     * Track une page vue
     * @param pageName Nom de la page
     * @param pagePath Chemin de la page
     */
    trackPage(pageName: string, pagePath: string) {
        if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.ENABLED) {
            // Si Cookiebot n'est pas encore chargé, attendre
            if (!this.cookiebotLoaded) {
                setTimeout(() => this.trackPage(pageName, pagePath), 500);
                return;
            }

            if (this.hasConsent()) {
                gtag('config', ANALYTICS_CONFIG.GA_MEASUREMENT_ID, {
                    page_title: pageName,
                    page_location: pagePath
                });

                if (ANALYTICS_CONFIG.DEBUG) {
                    console.log('GA Page View:', { pageName, pagePath });
                }
            }
        }
    }

    /**
     * Track un clic sur un lien externe
     * @param url L'URL du lien
     * @param linkText Le texte du lien
     */
    trackExternalLink(url: string, linkText: string) {
        this.trackEvent('click', 'external_link', `${linkText} - ${url}`);
    }

    /**
     * Track l'envoi du formulaire de contact
     * @param subject Le sujet du message
     */
    trackContactForm(subject: string) {
        this.trackEvent('contact_form_submit', 'engagement', subject);
    }

    /**
     * Track le téléchargement d'un fichier
     * @param fileName Nom du fichier
     * @param fileType Type du fichier
     */
    trackDownload(fileName: string, fileType: string) {
        this.trackEvent('file_download', 'engagement', `${fileName} (${fileType})`);
    }

    /**
     * Track l'engagement avec le contenu
     * @param contentType Type de contenu (ex: 'portfolio_item', 'skill')
     * @param contentName Nom du contenu
     */
    trackEngagement(contentType: string, contentName: string) {
        this.trackEvent('engagement', 'content', `${contentType}: ${contentName}`);
    }

    /**
     * Vérifie si l'utilisateur a donné son consentement
     * @returns true si le consentement est donné
     */
    private hasConsent(): boolean {
        // Vérifier le consentement via Cookiebot
        if (typeof window !== 'undefined' && (window as any).Cookiebot && (window as any).Cookiebot.consent) {
            return (window as any).Cookiebot.consent.statistics === true;
        }
        return false; // Par défaut, refuser le tracking si pas de consentement
    }
}
