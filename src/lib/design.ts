import type { DesignConfig } from './types'

export const DEFAULT_DESIGN: DesignConfig = {
  theme: 'modern', primary_color: '#7C3AED', background_color: '#F6F7FB',
  heading_font: 'Poppins', body_font: 'Inter', base_size: '16px',
  header_type: 'gradient', header_height: 'medium',
  card_style: 'soft_shadow', corner_radius: 'large',
  button_shape: 'rounded', button_size: 'medium',
  progress_bar: true, progress_style: 'line', progress_color: '#7C3AED',
  animations: true, page_transition: 'fade', element_animation: 'slide_up',
  form_width: 'medium', page_padding: 'large', question_spacing: 'comfortable', question_layout: 'cards',
  border_radius: 'medium', background_type: 'solid',
  welcome_enabled: true, welcome_button_label: 'Start', welcome_layout: 'center',
  welcome_button_shape: 'round', welcome_button_size: 'medium', welcome_logo_height: 56,
  welcome_container_enabled: true, welcome_container_bg: '#ffffff', welcome_container_border_color: '#e2e8f0', welcome_container_border_width: 1, welcome_container_animation: 'fade',
  thankyou_show_button: true, thankyou_button_label: 'Submit another',
  thankyou_logo_height: 56, thankyou_container_enabled: true, thankyou_container_bg: '#ffffff', thankyou_container_border_color: '#e2e8f0', thankyou_container_border_width: 1, thankyou_container_animation: 'fade',
}
