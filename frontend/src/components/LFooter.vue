<template>
   <footer class="footer">
      <div class="container">
         <div class="footer__area">
            <div class="row d-flex justify-content-center align-items-center">
               <div class="col-4">
                  <div class="footer__label">
                     <h4>Developed by John Doe</h4>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </footer>
</template>

<style lang="scss" scoped>
.footer {
   .footer__area {
    margin-top: 16px;
      width: 100%;
      min-height: 40px;
      padding: 16px 0;
      border-radius: var(--Corner-radius-Rounded---2XL, 16px);
      background: radial-gradient(98.93% 55.04% at 76.05% 55.01%, #f1f4ff 2.19%, rgba(241, 244, 255, 0.1) 92.08%),
         var(--Colours-Internal-Colours-BG, #ccdbf1);

      .footer__label {
         display: flex;
         justify-content: center;
         align-items: center;

         h4 {
            border-radius: var(--Corner-radius-Rounded---None, 0px);
            background: var(--colours-exterior-colours-bg-header-1, rgba(224, 235, 252, 0.5));

            /* Blur BG_Header */
            backdrop-filter: blur(5px);
         }
      }
   }
}
</style>
