<template lang="pug">
.supported-chains
  .alcor-inner
    SectionTitle.section-title {{ $t('SUPPORTED_UPCOMING_CHAINS_TITLE') }}
    .chains
      img.chain(v-if="$colorMode.value == 'light'" src='~/assets/images/supportedchain-4-dark.svg')
      img.chain(v-else src='~/assets/images/supportedchain-4.svg')
      img.chain(src='~/assets/images/supportedchain-1.svg')
      img.chain(src='~/assets/images/supportedchain-2.svg')
      img.chain(v-if="$colorMode.value == 'light'" src='~/assets/images/supportedchain-3-dark.svg')
      img.chain(v-else src='~/assets/images/supportedchain-3.svg')
      span.more {{ $t('and more...') }}
    .inner-container
      span.title {{ $t('BUILDINGGLOBALCOMMUNITY') }}
      .text {{ $t('LEARNMORE') }}
      .social-items
        a.item(href="https://t.me/alcorexchange" target="_blank")
          .icon
            img(src='~/assets/icons/Telegram.svg')
          span.name Telegram
          span.desc {{ $t('TRAIDING_TALKS') }}
        a.item(href="https://twitter.com/alcorexchange" target="_blank")
          .icon
            img(src='~/assets/icons/Twitter.svg')
          span.name Twitter
          span.desc {{ $t('ANOUNCEMENT') }}
        a.item(href="https://discord.gg/Sxum2ETSzq" target="_blank")
          .icon
            img(src='~/assets/icons/Discord.svg')
          span.name Discord
          span.desc {{ $t('General Chatting') }}
        a.item(href="https://avral.medium.com/" target="_blank")
          .icon
            img(src='~/assets/icons/Monogram.svg')
          span.name Medium
          span.desc {{ $t('REVIEW_NEWS') }}
        a.item(href="https://github.com/avral/alcor-ui" target="_blank")
          .icon
            img(src='~/assets/icons/Github.svg')
          span.name Github
          span.desc {{ $t('CODE_CONTIBUTE') }}
        a.item(href="http://api.alcor.exchange/" target="_blank")
          .icon
            img(src='~/assets/icons/Api.svg')
          span.name API
          span.desc {{ $t('Alcor API Docs') }}

        a.item(href="https://alcor.featurebase.app" target="_blank")
          .icon
            img(src='~/assets/icons/feature-request.webp')
          span.name Feature request
          span.desc Participate in development

        a.item(href="https://status.alcor.exchange" target="_blank")
          .icon
            img(src='~/assets/icons/health-check.png')
          span.name Status Page
          span.desc Check services health

      span.title {{ $t('PARTNERS_PROVIDERS') }}
      .items
        a.item(v-for="{ image, lightImage, url, padding } in items" :href="url" target="_blank" :style="{ padding }")
          img(:src="$colorMode.value == 'dark' ? image : lightImage")
        a(href="https://eosamsterdam.net/")
          EOS(v-if="$colorMode.value == 'dark'")
          img(v-else src='~/assets/images/partners-1.svg')

</template>

<script>
import SectionTitle from '@/components/landing/SectionTitle'
import SSpacer from '@/components/SSpacer'
import EOS from '@/components/partners/EOS'
export default {
  name: 'SupportedChains',
  components: {
    SectionTitle,
    SSpacer,
    EOS
  },
  data: () => ({
    items: [
      {
        image: require('@/assets/icons/Graymass_white.svg'),
        lightImage: require('@/assets/icons/Graymass.svg'),
        url: 'https://greymass.com/en/'
      },
    ]
  })
}
</script>

<style scoped lang="scss">
.supported-chains {
  background: linear-gradient(181.03deg,
      rgba(255, 255, 255, 0) 0%,

      rgba(57, 255, 136, 0.02) 15%,
      rgba(57, 255, 136, 0.1) 50%,
      rgba(57, 255, 136, 0.02) 85%,

      rgba(255, 255, 255, 0) 100%);
  padding: 20px 0;
  min-height: 300px;
}

.section-title {
  margin-bottom: 40px;
}

.chains {
  margin-bottom: 60px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.inner-container {
  padding: 40px 10px;
  background-color: var(--hover);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-size: 2rem;
    text-align: center;

    &:last-of-type {
      margin-top: 40px;
    }
  }

  .text {
    text-align: center;
    margin: 10px 0;
    margin-bottom: 40px;
    color: var(--text-grey-thirdly);
  }

  .social-items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: opacity 0.3s;

      padding: 8px 12px;

      &:hover {
        opacity: 0.8;
      }

      .icon {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: 12px;

        img {
          width: 48px;
          height: 48px;
        }
      }
    }

    .name {
      margin: 8px 0;
      color: var(--text-default);
      font-size: 22px;
      font-weight: medium;
    }

    .desc {
      color: var(--text-grey-thirdly);
      text-align: center;
    }

    @media only screen and (max-width: 680px) {
      grid-template-columns: repeat(2, 1fr);
      column-gap: 10px;
      row-gap: 24px;
      .item {
        padding: 0 !important;
        font-size: 14px;
      }
      .name {
        font-size: 20px;
      }
    }
  }
}

.chain {
  object-fit: contain;
}

@media only screen and (max-width: 1240px) {
  .chains {
    justify-content: center;
    align-items: center;

    .chain {
      margin: 12px;
    }
  }
}

@media only screen and (max-width: 640px) {
  .chains {
    flex-direction: column;
  }

  .chain {
    max-width: 90%;
    fill: red;
    color: red;

  }

  .more {
    margin-top: 15px;
  }
}


.items {
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 70px;

  @media only screen and (max-width: 600px) {
    gap: 36px;
  }


  .item {
    display: flex;

    img {
      height: 46px;

      @media only screen and (max-width: 600px) {
        height: 26px;
      }

    }
  }
}
</style>
